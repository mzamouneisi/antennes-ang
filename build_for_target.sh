usage() {
    echo "
        $0 cible
        ex:
        $0 AZURE 
        $0 RENDER 
    "
    exit 1
}

if (($#<1)); then usage; fi 
cible=$1

echo "
    cible=$cible
"

file_service=src/app/service/Aservice.ts
[ ! -f $file_service ] && {
    echo "
        file_service NOT EXIST : $file_service 
    "
    exit 1
}

echo "
    check if exist API_URL_$cible in $file_service 
"
grep "API_URL_$cible" $file_service 2>/dev/null 
[ $? != 0 ] && usage

echo "
    change API_URL
"
awk -v cible="$cible" '
{
    if($1 == "protected" && $2 == "API_URL") print "protected API_URL = this.API_URL_" cible ";"
    else print 
}
' $file_service > $file_service.tmp 
# mv $file_service.tmp $file_service
exit 

echo "
    gen build 
"
[ $? == 0 ] && {
    ng build --configuration production --output-path=for_$cible --base-href .
}

echo "
    commit to git 
"
[ $? == 0 ] && {
    git_save_all_with_comment.sh "build for $cible"
}

