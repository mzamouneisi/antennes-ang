
export class Antenne {
	id: number | null ;

    dEPT: string;
    g2R: string;
    nom_Site: string;
    uO: string;
    sTATUT_UO: string;
    cdP_Planif_DSOR: string;
    aCTEUR_PATRIMOINE_REGION: string;
    rESPONSABLE_SITE: string;
    aVANCEMENT: string;
    pORTEUR_PROSPECTION: string;
    bAILLEUR: string;
    pROGRAMME: string;
    pROJET: string;
    tYPE_DE_SUPPORT_PROSPECT_RETENU: string;
    uO_Fibre: string;
    statut_UO_Fibre: string;
    projet_Fibre: string;
    date_previsionnelle_de_fin_UO_Fibre: string;
    rEMONTEE_DE_PROSPECTS: string;
    aVIS_RADIO: string;
    aRBITRAGE_PROSPECT: string;
    aVIS_TRANS: string;
    aCCORD_DE_PRINCIPE: string;
    vT: string;
    cOMITE_SITE_NEUF: string;
    cHOIX_PROSPECT: string;
    eNVOI_EB: string;
    rEPONSE_EBS: string;
    rEDACTION_DTB: string;
    vALIDATION_DTB: string;
    dEVIS_TS: string;
    date_planifiee_confirmee_DEVIS_TS: string;
    dOSSIER_INFORMATION_MAIRIE: string;
    date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE: string;
    dEPOT_ADMIN: string;
    date_de_Real_DEPOT_ADMIN: string;
    aUTO_ADMIN: string;
    date_planifiee_confirmee_AUTO_ADMIN: string;
    cONTAINER_HW_Radio: string;
    cONTAINER_HW_Antenne: string;
    cONTAINER_HW_FH: string;
    dEMANDE_ENEDIS: string;
    dEVIS_ENEDIS: string;
    sIGNATURE_CONVENTION: string;
    gO_REALISATION: string;
    date_de_Realisation_Jalon_ARA_GO_REALISATION: string;
    date_planifiee_confirmee_GO_REALISATION: string;
    mAD_INFRA: string;
    date_planifiee_confirmee_MAD_INFRA: string;
    mAD_ENEDIS_DEFINITIF: string;
    date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF: string;
    mES: string;
    date_planifiee_confirmee_MES: string;
    rECETTE: string;
    pARFAIT_ACHEVEMENT: string;
    date_antenne: string;

 constructor(
   id: number | null = null,
   dEPT: string =        ''
   ,
   g2R: string =        ''
   ,
   nom_Site: string =        ''
   ,
   uO: string =        ''
   ,
   sTATUT_UO: string =        ''
   ,
   cdP_Planif_DSOR: string =        ''
   ,
   aCTEUR_PATRIMOINE_REGION: string =        ''
   ,
   rESPONSABLE_SITE: string =        ''
   ,
   aVANCEMENT: string =        ''
   ,
   pORTEUR_PROSPECTION: string =        ''
   ,
   bAILLEUR: string =        ''
   ,
   pROGRAMME: string =        ''
   ,
   pROJET: string =        ''
   ,
   tYPE_DE_SUPPORT_PROSPECT_RETENU: string =        ''
   ,
   uO_Fibre: string =        ''
   ,
   statut_UO_Fibre: string =        ''
   ,
   projet_Fibre: string =        ''
   ,
   date_previsionnelle_de_fin_UO_Fibre: string =        ''
   ,
   rEMONTEE_DE_PROSPECTS: string =        ''
   ,
   aVIS_RADIO: string =        ''
   ,
   aRBITRAGE_PROSPECT: string =        ''
   ,
   aVIS_TRANS: string =        ''
   ,
   aCCORD_DE_PRINCIPE: string =        ''
   ,
   vT: string =        ''
   ,
   cOMITE_SITE_NEUF: string =        ''
   ,
   cHOIX_PROSPECT: string =        ''
   ,
   eNVOI_EB: string =        ''
   ,
   rEPONSE_EBS: string =        ''
   ,
   rEDACTION_DTB: string =        ''
   ,
   vALIDATION_DTB: string =        ''
   ,
   dEVIS_TS: string =        ''
   ,
   date_planifiee_confirmee_DEVIS_TS: string =        ''
   ,
   dOSSIER_INFORMATION_MAIRIE: string =        ''
   ,
   date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE: string =        ''
   ,
   dEPOT_ADMIN: string =        ''
   ,
   date_de_Real_DEPOT_ADMIN: string =        ''
   ,
   aUTO_ADMIN: string =        ''
   ,
   date_planifiee_confirmee_AUTO_ADMIN: string =        ''
   ,
   cONTAINER_HW_Radio: string =        ''
   ,
   cONTAINER_HW_Antenne: string =        ''
   ,
   cONTAINER_HW_FH: string =        ''
   ,
   dEMANDE_ENEDIS: string =        ''
   ,
   dEVIS_ENEDIS: string =        ''
   ,
   sIGNATURE_CONVENTION: string =        ''
   ,
   gO_REALISATION: string =        ''
   ,
   date_de_Realisation_Jalon_ARA_GO_REALISATION: string =        ''
   ,
   date_planifiee_confirmee_GO_REALISATION: string =        ''
   ,
   mAD_INFRA: string =        ''
   ,
   date_planifiee_confirmee_MAD_INFRA: string =        ''
   ,
   mAD_ENEDIS_DEFINITIF: string =        ''
   ,
   date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF: string =        ''
   ,
   mES: string =        ''
   ,
   date_planifiee_confirmee_MES: string =        ''
   ,
   rECETTE: string =        ''
   ,
   pARFAIT_ACHEVEMENT: string =        ''
   ,
   date_antenne: string =        ''
   
) {
   this.id = id;
   this.dEPT = dEPT;
   this.g2R = g2R;
   this.nom_Site = nom_Site;
   this.uO = uO;
   this.sTATUT_UO = sTATUT_UO;
   this.cdP_Planif_DSOR = cdP_Planif_DSOR;
   this.aCTEUR_PATRIMOINE_REGION = aCTEUR_PATRIMOINE_REGION;
   this.rESPONSABLE_SITE = rESPONSABLE_SITE;
   this.aVANCEMENT = aVANCEMENT;
   this.pORTEUR_PROSPECTION = pORTEUR_PROSPECTION;
   this.bAILLEUR = bAILLEUR;
   this.pROGRAMME = pROGRAMME;
   this.pROJET = pROJET;
   this.tYPE_DE_SUPPORT_PROSPECT_RETENU = tYPE_DE_SUPPORT_PROSPECT_RETENU;
   this.uO_Fibre = uO_Fibre;
   this.statut_UO_Fibre = statut_UO_Fibre;
   this.projet_Fibre = projet_Fibre;
   this.date_previsionnelle_de_fin_UO_Fibre = date_previsionnelle_de_fin_UO_Fibre;
   this.rEMONTEE_DE_PROSPECTS = rEMONTEE_DE_PROSPECTS;
   this.aVIS_RADIO = aVIS_RADIO;
   this.aRBITRAGE_PROSPECT = aRBITRAGE_PROSPECT;
   this.aVIS_TRANS = aVIS_TRANS;
   this.aCCORD_DE_PRINCIPE = aCCORD_DE_PRINCIPE;
   this.vT = vT;
   this.cOMITE_SITE_NEUF = cOMITE_SITE_NEUF;
   this.cHOIX_PROSPECT = cHOIX_PROSPECT;
   this.eNVOI_EB = eNVOI_EB;
   this.rEPONSE_EBS = rEPONSE_EBS;
   this.rEDACTION_DTB = rEDACTION_DTB;
   this.vALIDATION_DTB = vALIDATION_DTB;
   this.dEVIS_TS = dEVIS_TS;
   this.date_planifiee_confirmee_DEVIS_TS = date_planifiee_confirmee_DEVIS_TS;
   this.dOSSIER_INFORMATION_MAIRIE = dOSSIER_INFORMATION_MAIRIE;
   this.date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE = date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE;
   this.dEPOT_ADMIN = dEPOT_ADMIN;
   this.date_de_Real_DEPOT_ADMIN = date_de_Real_DEPOT_ADMIN;
   this.aUTO_ADMIN = aUTO_ADMIN;
   this.date_planifiee_confirmee_AUTO_ADMIN = date_planifiee_confirmee_AUTO_ADMIN;
   this.cONTAINER_HW_Radio = cONTAINER_HW_Radio;
   this.cONTAINER_HW_Antenne = cONTAINER_HW_Antenne;
   this.cONTAINER_HW_FH = cONTAINER_HW_FH;
   this.dEMANDE_ENEDIS = dEMANDE_ENEDIS;
   this.dEVIS_ENEDIS = dEVIS_ENEDIS;
   this.sIGNATURE_CONVENTION = sIGNATURE_CONVENTION;
   this.gO_REALISATION = gO_REALISATION;
   this.date_de_Realisation_Jalon_ARA_GO_REALISATION = date_de_Realisation_Jalon_ARA_GO_REALISATION;
   this.date_planifiee_confirmee_GO_REALISATION = date_planifiee_confirmee_GO_REALISATION;
   this.mAD_INFRA = mAD_INFRA;
   this.date_planifiee_confirmee_MAD_INFRA = date_planifiee_confirmee_MAD_INFRA;
   this.mAD_ENEDIS_DEFINITIF = mAD_ENEDIS_DEFINITIF;
   this.date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF = date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF;
   this.mES = mES;
   this.date_planifiee_confirmee_MES = date_planifiee_confirmee_MES;
   this.rECETTE = rECETTE;
   this.pARFAIT_ACHEVEMENT = pARFAIT_ACHEVEMENT;
   this.date_antenne = date_antenne;
 }
}
