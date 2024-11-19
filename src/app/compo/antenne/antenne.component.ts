import { AfterViewChecked, ChangeDetectionStrategy, Component, NgZone, OnInit} from '@angular/core';
import { saveAs } from 'file-saver'; // Utilisez file-saver pour télécharger les fichiers
import * as XLSX from 'xlsx';
import { Antenne } from '../../data/antenne.model';
import { AntenneService } from '../../service/antenne.service';
import { AuthService } from '../config/auth.service';

import { MatDialog } from '@angular/material/dialog';
import { UtilService } from 'src/app/utils/utils-service';
import { ConfirmDialogComponent } from '../util/confirm-dialog/confirm-dialog.component';
import { MyUser } from 'src/app/data/my-user.model';

const sepCsv = ";"
const csvEncoding = 'ISO-8859-1'

const tableProps = [
  'dEPT' , 
  'g2R' , 
  'nom_Site' , 
  'uO' , 
  'sTATUT_UO' , 
  'cdP_Planif_DSOR' , 
  'aCTEUR_PATRIMOINE_REGION' , 
  'rESPONSABLE_SITE' , 
  'aVANCEMENT' , 
  'pORTEUR_PROSPECTION' , 
  'bAILLEUR' , 
  'pROGRAMME' , 
  'pROJET' , 
  'tYPE_DE_SUPPORT_PROSPECT_RETENU' , 
  'uO_Fibre' , 
  'statut_UO_Fibre' , 
  'projet_Fibre' , 
  'date_previsionnelle_de_fin_UO_Fibre' , 
  'rEMONTEE_DE_PROSPECTS' , 
  'aVIS_RADIO' , 
  'aRBITRAGE_PROSPECT' , 
  'aVIS_TRANS' , 
  'aCCORD_DE_PRINCIPE' , 
  'vT' , 
  'cOMITE_SITE_NEUF' , 
  'cHOIX_PROSPECT' , 
  'eNVOI_EB' , 
  'rEPONSE_EBS' , 
  'rEDACTION_DTB' , 
  'vALIDATION_DTB' , 
  'dEVIS_TS' , 
  'date_planifiee_confirmee_DEVIS_TS' , 
  'dOSSIER_INFORMATION_MAIRIE' , 
  'date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE' , 
  'dEPOT_ADMIN' , 
  'date_de_Real_DEPOT_ADMIN' , 
  'aUTO_ADMIN' , 
  'date_planifiee_confirmee_AUTO_ADMIN' , 
  'cONTAINER_HW_Radio' , 
  'cONTAINER_HW_Antenne' , 
  'cONTAINER_HW_FH' , 
  'dEMANDE_ENEDIS' , 
  'dEVIS_ENEDIS' , 
  'sIGNATURE_CONVENTION' , 
  'gO_REALISATION' , 
  'date_de_Realisation_Jalon_ARA_GO_REALISATION' , 
  'date_planifiee_confirmee_GO_REALISATION' , 
  'mAD_INFRA' , 
  'date_planifiee_confirmee_MAD_INFRA' , 
  'mAD_ENEDIS_DEFINITIF' , 
  'date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF' , 
  'mES' , 
  'date_planifiee_confirmee_MES' , 
  'rECETTE' , 
  'pARFAIT_ACHEVEMENT' , 
  'date_antenne' 
];

const tableLabels = [
  "DEPT" , 
  "G2R" , 
  "Nom Site" , 
  "UO" , 
  "STATUT UO" , 
  "CdP Planif DSOR" , 
  "ACTEUR PATRIMOINE REGION" , 
  "RESPONSABLE SITE" , 
  "AVANCEMENT" , 
  "PORTEUR PROSPECTION" , 
  "BAILLEUR" , 
  "PROGRAMME" , 
  "PROJET" , 
  "TYPE DE SUPPORT PROSPECT RETENU" , 
  "UO Fibre" , 
  "Statut UO Fibre" , 
  "Projet Fibre" , 
  "Date prévisionnelle de fin UO Fibre" , 
  "REMONTEE DE PROSPECTS" , 
  "AVIS RADIO" , 
  "ARBITRAGE PROSPECT" , 
  "AVIS TRANS" , 
  "ACCORD DE PRINCIPE" , 
  "VT" , 
  "COMITE SITE NEUF" , 
  "CHOIX PROSPECT" , 
  "ENVOI EB" , 
  "REPONSE EBS" , 
  "REDACTION DTB" , 
  "VALIDATION DTB" , 
  "DEVIS TS" , 
  "Date planifiée confirmée DEVIS TS" , 
  "DOSSIER INFORMATION MAIRIE" , 
  "Date de Réalisation Jalon&ARA DOSSIER INFORMATION MAIRIE" , 
  "DEPOT-ADMIN" , 
  "Date de Réal° DEPOT-ADMIN" , 
  "AUTO-ADMIN" , 
  "Date planifiée confirmée AUTO-ADMIN" , 
  "CONTAINER HW Radio" , 
  "CONTAINER HW Antenne" , 
  "CONTAINER HW FH" , 
  "DEMANDE ENEDIS" , 
  "DEVIS ENEDIS" , 
  "SIGNATURE CONVENTION" , 
  "GO REALISATION" , 
  "Date de Réalisation Jalon&ARA GO REALISATION" , 
  "Date planifiée confirmée GO REALISATION" , 
  "MAD INFRA" , 
  "Date planifiée confirmée MAD INFRA" , 
  "MAD ENEDIS DEFINITIF" , 
  "Date planifiée confirmée MAD ENEDIS DEFINITIF" , 
  "MES" , 
  "Date planifiée confirmée MES" , 
  "RECETTE" , 
  "PARFAIT ACHEVEMENT" , 
  "Date" 
];

@Component({
  selector: 'app-antenne',
  templateUrl: './antenne.component.html',
  styleUrls: ['./antenne.component.css'],
  changeDetection: ChangeDetectionStrategy.Default
})
export class AntenneComponent implements OnInit, AfterViewChecked {
  infos = "";
  startDateChargement = new Date() 
  isTableReady: boolean = false;
  myList: Antenne [] = [];
  modeIncremental: boolean = true;
  userConnected = this.authService.userConnected;
  nbElemVisible = this.filteredList?.length 

  mapPropLabel: { [key: string]: string } = {};
  mapLabelProp: { [key: string]: string } = {};

  tableLabels = tableLabels;

  constructor(private myService: AntenneService, public authService: AuthService, private dialog: MatDialog, public util: UtilService, private zone: NgZone) {
    this.userConnected = this.authService.getUserConnected()
  }

  ngOnInit(): void {
    this.findAll();
    this.initMaps();
  }

  initMaps() {
    tableProps.forEach((header, index) => {
      this.mapPropLabel[header] = tableLabels[index]
    });

    tableLabels.forEach((header, index) => {
      this.mapLabelProp[header] = tableProps[index]
    });

  }

  startInfosChargement() {
    this.startDateChargement = new Date()
    this.infos = 'Chargement en cours ... A : ' + this.util.dateToString(this.startDateChargement);
  }

  ngAfterViewChecked() {
    if (this.filteredList.length > 0 && !this.isTableReady) {
      const lastRowId = "row-" + this.filteredList.length;
      const lastRow = document.getElementById(lastRowId);

      if (lastRow) {
        this.isTableReady = true;
        console.log('Dernière ligne détectée :', lastRow);
        // Utilisation de `NgZone.run` pour éviter l'erreur
        this.zone.run(() => {
          this.endInfosChargement();
        });
      }
    }
  }

  endInfosChargement() {
    setTimeout(
      () => {
        this.infos = 'Chargement terminé en : ' + this.util.getDurationMnSs(this.startDateChargement);
        console.log(this.infos);
      }, 0
    )
  }

  findAll() {
    this.startInfosChargement();

    console.log('IHMM Antenne findAll');
    this.myService.findAll().subscribe(
      (data) => {
        console.log('findAll : data :', data);
        this.myList = data;
        this.myService.setMyList(this.myList);
        // this.endInfosChargement();
      },
      (error) => {
        console.error('Erreur findAll', error);
        this.endInfosChargement(); // Arrêter l'intervalle même en cas d'erreur
        this.zone.run(() => {
          this.infos += '. Erreur lors du chargement.';
        });
      }
    );
  }

  currentObj: Antenne = this.getObjInit();
  editingIndex: number | null = null;  // Index de l'utilisateur en cours d'édition
  isShowForm = true 

    // Filtres
    // nameFilter: string = '';

        dEPTFilter: string = '';
        g2RFilter: string = '';
        nom_SiteFilter: string = '';
        uOFilter: string = '';
        sTATUT_UOFilter: string = '';
        cdP_Planif_DSORFilter: string = '';
        aCTEUR_PATRIMOINE_REGIONFilter: string = '';
        rESPONSABLE_SITEFilter: string = '';
        aVANCEMENTFilter: string = '';
        pORTEUR_PROSPECTIONFilter: string = '';
        bAILLEURFilter: string = '';
        pROGRAMMEFilter: string = '';
        pROJETFilter: string = '';
        tYPE_DE_SUPPORT_PROSPECT_RETENUFilter: string = '';
        uO_FibreFilter: string = '';
        statut_UO_FibreFilter: string = '';
        projet_FibreFilter: string = '';
        date_previsionnelle_de_fin_UO_FibreFilter: string = '';
        rEMONTEE_DE_PROSPECTSFilter: string = '';
        aVIS_RADIOFilter: string = '';
        aRBITRAGE_PROSPECTFilter: string = '';
        aVIS_TRANSFilter: string = '';
        aCCORD_DE_PRINCIPEFilter: string = '';
        vTFilter: string = '';
        cOMITE_SITE_NEUFFilter: string = '';
        cHOIX_PROSPECTFilter: string = '';
        eNVOI_EBFilter: string = '';
        rEPONSE_EBSFilter: string = '';
        rEDACTION_DTBFilter: string = '';
        vALIDATION_DTBFilter: string = '';
        dEVIS_TSFilter: string = '';
        date_planifiee_confirmee_DEVIS_TSFilter: string = '';
        dOSSIER_INFORMATION_MAIRIEFilter: string = '';
        date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIEFilter: string = '';
        dEPOT_ADMINFilter: string = '';
        date_de_Real_DEPOT_ADMINFilter: string = '';
        aUTO_ADMINFilter: string = '';
        date_planifiee_confirmee_AUTO_ADMINFilter: string = '';
        cONTAINER_HW_RadioFilter: string = '';
        cONTAINER_HW_AntenneFilter: string = '';
        cONTAINER_HW_FHFilter: string = '';
        dEMANDE_ENEDISFilter: string = '';
        dEVIS_ENEDISFilter: string = '';
        sIGNATURE_CONVENTIONFilter: string = '';
        gO_REALISATIONFilter: string = '';
        date_de_Realisation_Jalon_ARA_GO_REALISATIONFilter: string = '';
        date_planifiee_confirmee_GO_REALISATIONFilter: string = '';
        mAD_INFRAFilter: string = '';
        date_planifiee_confirmee_MAD_INFRAFilter: string = '';
        mAD_ENEDIS_DEFINITIFFilter: string = '';
        date_planifiee_confirmee_MAD_ENEDIS_DEFINITIFFilter: string = '';
        mESFilter: string = '';
        date_planifiee_confirmee_MESFilter: string = '';
        rECETTEFilter: string = '';
        pARFAIT_ACHEVEMENTFilter: string = '';
        date_antenneFilter: string = '';

  showPanelExport = false
  showPanelImport = false

  // Méthode pour filtrer les utilisateurs
  get filteredList(): Antenne [] {
    return this.myList.filter(obj => {
      return (
        (!this.dEPTFilter || (this.dEPTFilter && obj.dEPT && obj.dEPT.toLowerCase().includes(this.dEPTFilter.toLowerCase()) ) ) && 
        (!this.g2RFilter || (this.g2RFilter && obj.g2R && obj.g2R.toLowerCase().includes(this.g2RFilter.toLowerCase()) ) ) && 
        (!this.nom_SiteFilter || (this.nom_SiteFilter && obj.nom_Site && obj.nom_Site.toLowerCase().includes(this.nom_SiteFilter.toLowerCase()) ) ) && 
        (!this.uOFilter || (this.uOFilter && obj.uO && obj.uO.toLowerCase().includes(this.uOFilter.toLowerCase()) ) ) && 
        (!this.sTATUT_UOFilter || (this.sTATUT_UOFilter && obj.sTATUT_UO && obj.sTATUT_UO.toLowerCase().includes(this.sTATUT_UOFilter.toLowerCase()) ) ) && 
        (!this.cdP_Planif_DSORFilter || (this.cdP_Planif_DSORFilter && obj.cdP_Planif_DSOR && obj.cdP_Planif_DSOR.toLowerCase().includes(this.cdP_Planif_DSORFilter.toLowerCase()) ) ) && 
        (!this.aCTEUR_PATRIMOINE_REGIONFilter || (this.aCTEUR_PATRIMOINE_REGIONFilter && obj.aCTEUR_PATRIMOINE_REGION && obj.aCTEUR_PATRIMOINE_REGION.toLowerCase().includes(this.aCTEUR_PATRIMOINE_REGIONFilter.toLowerCase()) ) ) && 
        (!this.rESPONSABLE_SITEFilter || (this.rESPONSABLE_SITEFilter && obj.rESPONSABLE_SITE && obj.rESPONSABLE_SITE.toLowerCase().includes(this.rESPONSABLE_SITEFilter.toLowerCase()) ) ) && 
        (!this.aVANCEMENTFilter || (this.aVANCEMENTFilter && obj.aVANCEMENT && obj.aVANCEMENT.toLowerCase().includes(this.aVANCEMENTFilter.toLowerCase()) ) ) && 
        (!this.pORTEUR_PROSPECTIONFilter || (this.pORTEUR_PROSPECTIONFilter && obj.pORTEUR_PROSPECTION && obj.pORTEUR_PROSPECTION.toLowerCase().includes(this.pORTEUR_PROSPECTIONFilter.toLowerCase()) ) ) && 
        (!this.bAILLEURFilter || (this.bAILLEURFilter && obj.bAILLEUR && obj.bAILLEUR.toLowerCase().includes(this.bAILLEURFilter.toLowerCase()) ) ) && 
        (!this.pROGRAMMEFilter || (this.pROGRAMMEFilter && obj.pROGRAMME && obj.pROGRAMME.toLowerCase().includes(this.pROGRAMMEFilter.toLowerCase()) ) ) && 
        (!this.pROJETFilter || (this.pROJETFilter && obj.pROJET && obj.pROJET.toLowerCase().includes(this.pROJETFilter.toLowerCase()) ) ) && 
        (!this.tYPE_DE_SUPPORT_PROSPECT_RETENUFilter || (this.tYPE_DE_SUPPORT_PROSPECT_RETENUFilter && obj.tYPE_DE_SUPPORT_PROSPECT_RETENU && obj.tYPE_DE_SUPPORT_PROSPECT_RETENU.toLowerCase().includes(this.tYPE_DE_SUPPORT_PROSPECT_RETENUFilter.toLowerCase()) ) ) && 
        (!this.uO_FibreFilter || (this.uO_FibreFilter && obj.uO_Fibre && obj.uO_Fibre.toLowerCase().includes(this.uO_FibreFilter.toLowerCase()) ) ) && 
        (!this.statut_UO_FibreFilter || (this.statut_UO_FibreFilter && obj.statut_UO_Fibre && obj.statut_UO_Fibre.toLowerCase().includes(this.statut_UO_FibreFilter.toLowerCase()) ) ) && 
        (!this.projet_FibreFilter || (this.projet_FibreFilter && obj.projet_Fibre && obj.projet_Fibre.toLowerCase().includes(this.projet_FibreFilter.toLowerCase()) ) ) && 
        (!this.date_previsionnelle_de_fin_UO_FibreFilter || (this.date_previsionnelle_de_fin_UO_FibreFilter && obj.date_previsionnelle_de_fin_UO_Fibre && obj.date_previsionnelle_de_fin_UO_Fibre.toLowerCase().includes(this.date_previsionnelle_de_fin_UO_FibreFilter.toLowerCase()) ) ) && 
        (!this.rEMONTEE_DE_PROSPECTSFilter || (this.rEMONTEE_DE_PROSPECTSFilter && obj.rEMONTEE_DE_PROSPECTS && obj.rEMONTEE_DE_PROSPECTS.toLowerCase().includes(this.rEMONTEE_DE_PROSPECTSFilter.toLowerCase()) ) ) && 
        (!this.aVIS_RADIOFilter || (this.aVIS_RADIOFilter && obj.aVIS_RADIO && obj.aVIS_RADIO.toLowerCase().includes(this.aVIS_RADIOFilter.toLowerCase()) ) ) && 
        (!this.aRBITRAGE_PROSPECTFilter || (this.aRBITRAGE_PROSPECTFilter && obj.aRBITRAGE_PROSPECT && obj.aRBITRAGE_PROSPECT.toLowerCase().includes(this.aRBITRAGE_PROSPECTFilter.toLowerCase()) ) ) && 
        (!this.aVIS_TRANSFilter || (this.aVIS_TRANSFilter && obj.aVIS_TRANS && obj.aVIS_TRANS.toLowerCase().includes(this.aVIS_TRANSFilter.toLowerCase()) ) ) && 
        (!this.aCCORD_DE_PRINCIPEFilter || (this.aCCORD_DE_PRINCIPEFilter && obj.aCCORD_DE_PRINCIPE && obj.aCCORD_DE_PRINCIPE.toLowerCase().includes(this.aCCORD_DE_PRINCIPEFilter.toLowerCase()) ) ) && 
        (!this.vTFilter || (this.vTFilter && obj.vT && obj.vT.toLowerCase().includes(this.vTFilter.toLowerCase()) ) ) && 
        (!this.cOMITE_SITE_NEUFFilter || (this.cOMITE_SITE_NEUFFilter && obj.cOMITE_SITE_NEUF && obj.cOMITE_SITE_NEUF.toLowerCase().includes(this.cOMITE_SITE_NEUFFilter.toLowerCase()) ) ) && 
        (!this.cHOIX_PROSPECTFilter || (this.cHOIX_PROSPECTFilter && obj.cHOIX_PROSPECT && obj.cHOIX_PROSPECT.toLowerCase().includes(this.cHOIX_PROSPECTFilter.toLowerCase()) ) ) && 
        (!this.eNVOI_EBFilter || (this.eNVOI_EBFilter && obj.eNVOI_EB && obj.eNVOI_EB.toLowerCase().includes(this.eNVOI_EBFilter.toLowerCase()) ) ) && 
        (!this.rEPONSE_EBSFilter || (this.rEPONSE_EBSFilter && obj.rEPONSE_EBS && obj.rEPONSE_EBS.toLowerCase().includes(this.rEPONSE_EBSFilter.toLowerCase()) ) ) && 
        (!this.rEDACTION_DTBFilter || (this.rEDACTION_DTBFilter && obj.rEDACTION_DTB && obj.rEDACTION_DTB.toLowerCase().includes(this.rEDACTION_DTBFilter.toLowerCase()) ) ) && 
        (!this.vALIDATION_DTBFilter || (this.vALIDATION_DTBFilter && obj.vALIDATION_DTB && obj.vALIDATION_DTB.toLowerCase().includes(this.vALIDATION_DTBFilter.toLowerCase()) ) ) && 
        (!this.dEVIS_TSFilter || (this.dEVIS_TSFilter && obj.dEVIS_TS && obj.dEVIS_TS.toLowerCase().includes(this.dEVIS_TSFilter.toLowerCase()) ) ) && 
        (!this.date_planifiee_confirmee_DEVIS_TSFilter || (this.date_planifiee_confirmee_DEVIS_TSFilter && obj.date_planifiee_confirmee_DEVIS_TS && obj.date_planifiee_confirmee_DEVIS_TS.toLowerCase().includes(this.date_planifiee_confirmee_DEVIS_TSFilter.toLowerCase()) ) ) && 
        (!this.dOSSIER_INFORMATION_MAIRIEFilter || (this.dOSSIER_INFORMATION_MAIRIEFilter && obj.dOSSIER_INFORMATION_MAIRIE && obj.dOSSIER_INFORMATION_MAIRIE.toLowerCase().includes(this.dOSSIER_INFORMATION_MAIRIEFilter.toLowerCase()) ) ) && 
        (!this.date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIEFilter || (this.date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIEFilter && obj.date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE && obj.date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE.toLowerCase().includes(this.date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIEFilter.toLowerCase()) ) ) && 
        (!this.dEPOT_ADMINFilter || (this.dEPOT_ADMINFilter && obj.dEPOT_ADMIN && obj.dEPOT_ADMIN.toLowerCase().includes(this.dEPOT_ADMINFilter.toLowerCase()) ) ) && 
        (!this.date_de_Real_DEPOT_ADMINFilter || (this.date_de_Real_DEPOT_ADMINFilter && obj.date_de_Real_DEPOT_ADMIN && obj.date_de_Real_DEPOT_ADMIN.toLowerCase().includes(this.date_de_Real_DEPOT_ADMINFilter.toLowerCase()) ) ) && 
        (!this.aUTO_ADMINFilter || (this.aUTO_ADMINFilter && obj.aUTO_ADMIN && obj.aUTO_ADMIN.toLowerCase().includes(this.aUTO_ADMINFilter.toLowerCase()) ) ) && 
        (!this.date_planifiee_confirmee_AUTO_ADMINFilter || (this.date_planifiee_confirmee_AUTO_ADMINFilter && obj.date_planifiee_confirmee_AUTO_ADMIN && obj.date_planifiee_confirmee_AUTO_ADMIN.toLowerCase().includes(this.date_planifiee_confirmee_AUTO_ADMINFilter.toLowerCase()) ) ) && 
        (!this.cONTAINER_HW_RadioFilter || (this.cONTAINER_HW_RadioFilter && obj.cONTAINER_HW_Radio && obj.cONTAINER_HW_Radio.toLowerCase().includes(this.cONTAINER_HW_RadioFilter.toLowerCase()) ) ) && 
        (!this.cONTAINER_HW_AntenneFilter || (this.cONTAINER_HW_AntenneFilter && obj.cONTAINER_HW_Antenne && obj.cONTAINER_HW_Antenne.toLowerCase().includes(this.cONTAINER_HW_AntenneFilter.toLowerCase()) ) ) && 
        (!this.cONTAINER_HW_FHFilter || (this.cONTAINER_HW_FHFilter && obj.cONTAINER_HW_FH && obj.cONTAINER_HW_FH.toLowerCase().includes(this.cONTAINER_HW_FHFilter.toLowerCase()) ) ) && 
        (!this.dEMANDE_ENEDISFilter || (this.dEMANDE_ENEDISFilter && obj.dEMANDE_ENEDIS && obj.dEMANDE_ENEDIS.toLowerCase().includes(this.dEMANDE_ENEDISFilter.toLowerCase()) ) ) && 
        (!this.dEVIS_ENEDISFilter || (this.dEVIS_ENEDISFilter && obj.dEVIS_ENEDIS && obj.dEVIS_ENEDIS.toLowerCase().includes(this.dEVIS_ENEDISFilter.toLowerCase()) ) ) && 
        (!this.sIGNATURE_CONVENTIONFilter || (this.sIGNATURE_CONVENTIONFilter && obj.sIGNATURE_CONVENTION && obj.sIGNATURE_CONVENTION.toLowerCase().includes(this.sIGNATURE_CONVENTIONFilter.toLowerCase()) ) ) && 
        (!this.gO_REALISATIONFilter || (this.gO_REALISATIONFilter && obj.gO_REALISATION && obj.gO_REALISATION.toLowerCase().includes(this.gO_REALISATIONFilter.toLowerCase()) ) ) && 
        (!this.date_de_Realisation_Jalon_ARA_GO_REALISATIONFilter || (this.date_de_Realisation_Jalon_ARA_GO_REALISATIONFilter && obj.date_de_Realisation_Jalon_ARA_GO_REALISATION && obj.date_de_Realisation_Jalon_ARA_GO_REALISATION.toLowerCase().includes(this.date_de_Realisation_Jalon_ARA_GO_REALISATIONFilter.toLowerCase()) ) ) && 
        (!this.date_planifiee_confirmee_GO_REALISATIONFilter || (this.date_planifiee_confirmee_GO_REALISATIONFilter && obj.date_planifiee_confirmee_GO_REALISATION && obj.date_planifiee_confirmee_GO_REALISATION.toLowerCase().includes(this.date_planifiee_confirmee_GO_REALISATIONFilter.toLowerCase()) ) ) && 
        (!this.mAD_INFRAFilter || (this.mAD_INFRAFilter && obj.mAD_INFRA && obj.mAD_INFRA.toLowerCase().includes(this.mAD_INFRAFilter.toLowerCase()) ) ) && 
        (!this.date_planifiee_confirmee_MAD_INFRAFilter || (this.date_planifiee_confirmee_MAD_INFRAFilter && obj.date_planifiee_confirmee_MAD_INFRA && obj.date_planifiee_confirmee_MAD_INFRA.toLowerCase().includes(this.date_planifiee_confirmee_MAD_INFRAFilter.toLowerCase()) ) ) && 
        (!this.mAD_ENEDIS_DEFINITIFFilter || (this.mAD_ENEDIS_DEFINITIFFilter && obj.mAD_ENEDIS_DEFINITIF && obj.mAD_ENEDIS_DEFINITIF.toLowerCase().includes(this.mAD_ENEDIS_DEFINITIFFilter.toLowerCase()) ) ) && 
        (!this.date_planifiee_confirmee_MAD_ENEDIS_DEFINITIFFilter || (this.date_planifiee_confirmee_MAD_ENEDIS_DEFINITIFFilter && obj.date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF && obj.date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF.toLowerCase().includes(this.date_planifiee_confirmee_MAD_ENEDIS_DEFINITIFFilter.toLowerCase()) ) ) && 
        (!this.mESFilter || (this.mESFilter && obj.mES && obj.mES.toLowerCase().includes(this.mESFilter.toLowerCase()) ) ) && 
        (!this.date_planifiee_confirmee_MESFilter || (this.date_planifiee_confirmee_MESFilter && obj.date_planifiee_confirmee_MES && obj.date_planifiee_confirmee_MES.toLowerCase().includes(this.date_planifiee_confirmee_MESFilter.toLowerCase()) ) ) && 
        (!this.rECETTEFilter || (this.rECETTEFilter && obj.rECETTE && obj.rECETTE.toLowerCase().includes(this.rECETTEFilter.toLowerCase()) ) ) && 
        (!this.pARFAIT_ACHEVEMENTFilter || (this.pARFAIT_ACHEVEMENTFilter && obj.pARFAIT_ACHEVEMENT && obj.pARFAIT_ACHEVEMENT.toLowerCase().includes(this.pARFAIT_ACHEVEMENTFilter.toLowerCase()) ) ) && 
        (!this.date_antenneFilter || (this.date_antenneFilter && obj.date_antenne && obj.date_antenne.toLowerCase().includes(this.date_antenneFilter.toLowerCase()) ) ) 
      );
  });
}

isColIdUniqueOfCurrentObj(): boolean {
  // return !this.myList.some(obj => obj.email === this.currentObj.email);
  return !this.myList.some(obj => obj.uO === this.currentObj.uO);
}

  private findByColUniq(newObj: Antenne): Antenne | undefined {
  // return this.myList.find(obj => obj.email === newObj.email);
  return this.myList.find(obj => obj.uO === newObj.uO);
}

getObjInit(): Antenne {

  return {
    id: null, 
        dEPT:         ''
 , 
        g2R:         ''
 , 
        nom_Site:         ''
 , 
        uO:         ''
 , 
        sTATUT_UO:         ''
 , 
        cdP_Planif_DSOR:         ''
 , 
        aCTEUR_PATRIMOINE_REGION:         ''
 , 
        rESPONSABLE_SITE:         ''
 , 
        aVANCEMENT:         ''
 , 
        pORTEUR_PROSPECTION:         ''
 , 
        bAILLEUR:         ''
 , 
        pROGRAMME:         ''
 , 
        pROJET:         ''
 , 
        tYPE_DE_SUPPORT_PROSPECT_RETENU:         ''
 , 
        uO_Fibre:         ''
 , 
        statut_UO_Fibre:         ''
 , 
        projet_Fibre:         ''
 , 
        date_previsionnelle_de_fin_UO_Fibre:         ''
 , 
        rEMONTEE_DE_PROSPECTS:         ''
 , 
        aVIS_RADIO:         ''
 , 
        aRBITRAGE_PROSPECT:         ''
 , 
        aVIS_TRANS:         ''
 , 
        aCCORD_DE_PRINCIPE:         ''
 , 
        vT:         ''
 , 
        cOMITE_SITE_NEUF:         ''
 , 
        cHOIX_PROSPECT:         ''
 , 
        eNVOI_EB:         ''
 , 
        rEPONSE_EBS:         ''
 , 
        rEDACTION_DTB:         ''
 , 
        vALIDATION_DTB:         ''
 , 
        dEVIS_TS:         ''
 , 
        date_planifiee_confirmee_DEVIS_TS:         ''
 , 
        dOSSIER_INFORMATION_MAIRIE:         ''
 , 
        date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE:         ''
 , 
        dEPOT_ADMIN:         ''
 , 
        date_de_Real_DEPOT_ADMIN:         ''
 , 
        aUTO_ADMIN:         ''
 , 
        date_planifiee_confirmee_AUTO_ADMIN:         ''
 , 
        cONTAINER_HW_Radio:         ''
 , 
        cONTAINER_HW_Antenne:         ''
 , 
        cONTAINER_HW_FH:         ''
 , 
        dEMANDE_ENEDIS:         ''
 , 
        dEVIS_ENEDIS:         ''
 , 
        sIGNATURE_CONVENTION:         ''
 , 
        gO_REALISATION:         ''
 , 
        date_de_Realisation_Jalon_ARA_GO_REALISATION:         ''
 , 
        date_planifiee_confirmee_GO_REALISATION:         ''
 , 
        mAD_INFRA:         ''
 , 
        date_planifiee_confirmee_MAD_INFRA:         ''
 , 
        mAD_ENEDIS_DEFINITIF:         ''
 , 
        date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF:         ''
 , 
        mES:         ''
 , 
        date_planifiee_confirmee_MES:         ''
 , 
        rECETTE:         ''
 , 
        pARFAIT_ACHEVEMENT:         ''
 , 
        date_antenne:         ''
 
};
}



isObjValid(obj : Antenne) {
  return obj 
            && obj.uO
                                                                                                          ;
}

///////////////////////////////////////////////////

showActions(): boolean {
  const userConnected: MyUser | null = this.authService.getUserConnected();
  if (userConnected && userConnected.profile === "ADMIN") {
    return true;
  }
  return false;
}

showFormEdit() {
  return this.isShowForm || (this.myList && this.myList.length == 0)
}

closeFormEdit() {
  this.isShowForm = false
}

onRowClick(obj: any, index: number): void {
  console.log('Objet sélectionné:', obj);
  console.log('Indice:', index);
  
  this.editObj(index)
}

// Fonction pour éditer un utilisateur
editObj(index: number) {
  this.isShowForm = true  
  this.editingIndex = index;
  this.currentObj = { ...this.filteredList[index] };  // Cloner les données de l'utilisateur sélectionné
  // if (this.currentObj.dateNaiss) {
  //   this.currentObj.dateNaiss = new Date(this.currentObj.dateNaiss).toISOString().split('T')[0];
  // }
}

deleteCurrentObj() {

  this.deleteObj(this.editingIndex ? this.editingIndex : -1)

}

deleteObj(index: number) {
  if(index < 0) return 

  this.currentObj = this.filteredList[index]

  const dialogRef = this.dialog.open(ConfirmDialogComponent);

  dialogRef.afterClosed().subscribe(result => {
    if (result) {
      this.myService.deleteById(this.currentObj).subscribe(
        () => {
          this.findAll()
        },
        error => console.error('Error deleting user', error)
      );
    }
  });

}

initObj() {
  this.isShowForm = true
  this.currentObj = this.getObjInit();
  this.editingIndex = null;
}

saveObj() {

  if (this.editingIndex === null && !this.isColIdUniqueOfCurrentObj()) {
    alert('Cet <colUniq> est déjà utilisé !');
    return;
  }

  if (this.editingIndex !== null) {
    // if(this.currentObj.dateNaiss  ) {
    //   this.currentObj.dateNaiss = new Date(this.currentObj.dateNaiss).toISOString()
    // }
    console.log("save this.currentObj", this.currentObj)
    this.filteredList[this.editingIndex] = { ...this.currentObj };
    let i = this.editingIndex
    this.myService.save(this.currentObj).subscribe(data => {
      console.log("resp i, data : ", i, data)
      this.currentObj = data
      i = this.myService.getIndexInMyList(this.currentObj)
      this.myList[i] = { ...data };
    },
      error => {
        console.error('Error on save', error)
      }
    );
    this.editingIndex = null;
  } else {
    // Ajouter un nouvel utilisateur
    if (this.isObjValid(this.currentObj)) {
      this.myList.push({ ...this.currentObj });
      this.myService.add(this.currentObj).subscribe(data => {
        console.log(data)
      },
        error => {
          console.error('Error on add new ', error)
        }
      );
    }
  }

  this.myService.setMyList(this.myList)

  // Réinitialiser le formulaire
  this.currentObj = this.getObjInit();
}

// test() {
//   this.myService.test(this.currentObj).subscribe(data => {
//     console.log("test : data ", data)
//   },
//     error => {
//       console.error('Error test', error)
//     }
//   );
// }

////////////////////////////////////////////////

getCSVHeader() {
  return tableLabels.join(sepCsv) + '\n';
}

getCSVLine(obj: Antenne) {
  let line = '';

  // Parcourir les headers pour récupérer les propriétés correspondantes de l'utilisateur
  tableProps.forEach((header, index) => {
    // Si ce n'est pas le premier élément, ajouter une virgule pour séparer les valeurs
    if (index > 0) {
      line += sepCsv;
    }

    // Ajouter la valeur correspondante de l'utilisateur
    line += obj[header as keyof Antenne];  // Utilisation de 'as keyof' pour la sécurité de type
  });

  return line;
}

exportType: string = 'csv'; // Valeur par défaut

  export () {
  if (this.exportType === 'csv') {
    this.exportAsCSV();
  } else if (this.exportType === 'xlsx') {
    this.exportAsExcel();
  }
  this.showPanelExport = false
}


// Exporter les données filtrées en CSV
exportAsCSV() {
  const csvData = this.convertToCSV(this.filteredList);
  const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' });
  saveAs(blob, 'list_antenne.csv');
}

convertToCSV(data: Antenne[]): string {
  const header = this.getCSVHeader();
  const rows = data.map(obj => this.getCSVLine(obj)).join('\n');
  return header + rows;
}

// Exporter les données filtrées en Excel (XLSX)
exportAsExcel() {
  import('xlsx').then(xlsx => {
      // Créer la ligne d'en-tête personnalisée
  
      // Convertir filteredList en feuille de calcul
      const worksheet = xlsx.utils.json_to_sheet(this.filteredList, { skipHeader: true });
  
      // Insérer les en-têtes dans la première ligne
      xlsx.utils.sheet_add_aoa(worksheet, [tableLabels], { origin: 'A1' });
  
      // Créer le classeur avec la feuille de données
      const workbook = { Sheets: { data: worksheet }, SheetNames: ['data'] };
  
      // Générer le fichier Excel en tant que buffer
      const excelBuffer: any = xlsx.write(workbook, { bookType: 'xlsx', type: 'array' });
  
      // Créer le Blob pour téléchargement
      const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'list_antenne.xlsx');
  });
}

// Lorsque le fichier change (l'utilisateur sélectionne un fichier)
onFileChange(event: any) {

  this.myService.purgeAndSave().subscribe(data1 => {
    console.log("purgeAndSave : data : ", data1)

    console.log("onFileChange : modeIncremental : ", this.modeIncremental)

    if (!this.modeIncremental) {
      this.myList = []
    }

    console.log("onFileChange : myList : ", this.myList)

    const file = event.target.files[0];

    if (file) {
      const fileExtension = file.name.split('.').pop().toLowerCase();

      if (fileExtension === 'csv') {
        this.readCSV(file);
      } else if (fileExtension === 'xlsx') {
        this.readExcel(file);
      } else {
        alert('Veuillez sélectionner un fichier CSV ou Excel');
      }

    }

  },
    error1 => {
      console.error('Error purgeAndSave', error1)
    }
  );
}

getDurationMnSs(startTime : Date) : string {
  const endTime = new Date(); // Capture la fin
  const durationMs = endTime.getTime() - startTime.getTime(); // Temps en ms

  const minutes = Math.floor(durationMs / 60000); // Convertir en minutes
  const seconds = Math.floor((durationMs % 60000) / 1000); // Récupérer les secondes restantes
  return minutes + " min " + seconds + " sec"; // Formater l'information
}

importerInServer() {
  
  let startDate = new Date(); // Capture le début

  this.infos = ""
  this.infos = "import en cours ... a : " + this.util.dateToString(startDate)

  console.log("importerInServer : modeIncremental, myList : ", startDate, this.modeIncremental, this.myList);

  setTimeout(() => {

    this.myService.importer(this.myList, this.modeIncremental, false).subscribe(
      data => {

        this.infos = "import en : " + this.util.getDurationMnSs(startDate)

        console.log("importerInServer : data : ", data);
        console.log("Temps d'exécution : ", this.infos);
      },
      error => {
        console.error('Error importer', error);
        this.infos = 'Error importer' + error
      }
    );

  }, 0);
}

validateHeaders(expectedHeaders: string[], headers: string[]): boolean {
  // Vérifier la correspondance des colonnes
  const validFile = expectedHeaders.every(expectedHeader =>
    headers.some((header: string) => header.toLowerCase() === expectedHeader.toLowerCase())
  );

  if (!validFile) {
    if (!validFile) {
      const firstMissingHeader = expectedHeaders.find(expectedHeader =>
        !headers.some((header: string) => header.toLowerCase() === expectedHeader.toLowerCase())
      );

      if (firstMissingHeader) {
        let msg = 'Le fichier ne contient pas les colonnes attendues. Importation annulée.\n' +
          'Première colonne manquante : ' + firstMissingHeader + '\n' +
          'Colonnes lues : ' + headers.join(', ') ;

        console.log(msg, "<firstMissingHeader>:", firstMissingHeader, "<headers>:", headers) ;
        alert(msg);
      }
    }
  }
  return validFile;
}

initObjWithLine(newObj : Antenne, columns : any[], indexes: { [key: string]: number } = {}) {
  let idStr = columns[indexes[this.mapPropLabel["id"]]]

  newObj.id = idStr ? parseNumber(idStr) : null


      newObj.dEPT = parseString(columns[indexes[this.mapPropLabel['dEPT']]]);


      newObj.g2R = parseString(columns[indexes[this.mapPropLabel['g2R']]]);


      newObj.nom_Site = parseString(columns[indexes[this.mapPropLabel['nom_Site']]]);


      newObj.uO = parseString(columns[indexes[this.mapPropLabel['uO']]]);


      newObj.sTATUT_UO = parseString(columns[indexes[this.mapPropLabel['sTATUT_UO']]]);


      newObj.cdP_Planif_DSOR = parseString(columns[indexes[this.mapPropLabel['cdP_Planif_DSOR']]]);


      newObj.aCTEUR_PATRIMOINE_REGION = parseString(columns[indexes[this.mapPropLabel['aCTEUR_PATRIMOINE_REGION']]]);


      newObj.rESPONSABLE_SITE = parseString(columns[indexes[this.mapPropLabel['rESPONSABLE_SITE']]]);


      newObj.aVANCEMENT = parseString(columns[indexes[this.mapPropLabel['aVANCEMENT']]]);


      newObj.pORTEUR_PROSPECTION = parseString(columns[indexes[this.mapPropLabel['pORTEUR_PROSPECTION']]]);


      newObj.bAILLEUR = parseString(columns[indexes[this.mapPropLabel['bAILLEUR']]]);


      newObj.pROGRAMME = parseString(columns[indexes[this.mapPropLabel['pROGRAMME']]]);


      newObj.pROJET = parseString(columns[indexes[this.mapPropLabel['pROJET']]]);


      newObj.tYPE_DE_SUPPORT_PROSPECT_RETENU = parseString(columns[indexes[this.mapPropLabel['tYPE_DE_SUPPORT_PROSPECT_RETENU']]]);


      newObj.uO_Fibre = parseString(columns[indexes[this.mapPropLabel['uO_Fibre']]]);


      newObj.statut_UO_Fibre = parseString(columns[indexes[this.mapPropLabel['statut_UO_Fibre']]]);


      newObj.projet_Fibre = parseString(columns[indexes[this.mapPropLabel['projet_Fibre']]]);


      newObj.date_previsionnelle_de_fin_UO_Fibre = parseString(columns[indexes[this.mapPropLabel['date_previsionnelle_de_fin_UO_Fibre']]]);


      newObj.rEMONTEE_DE_PROSPECTS = parseString(columns[indexes[this.mapPropLabel['rEMONTEE_DE_PROSPECTS']]]);


      newObj.aVIS_RADIO = parseString(columns[indexes[this.mapPropLabel['aVIS_RADIO']]]);


      newObj.aRBITRAGE_PROSPECT = parseString(columns[indexes[this.mapPropLabel['aRBITRAGE_PROSPECT']]]);


      newObj.aVIS_TRANS = parseString(columns[indexes[this.mapPropLabel['aVIS_TRANS']]]);


      newObj.aCCORD_DE_PRINCIPE = parseString(columns[indexes[this.mapPropLabel['aCCORD_DE_PRINCIPE']]]);


      newObj.vT = parseString(columns[indexes[this.mapPropLabel['vT']]]);


      newObj.cOMITE_SITE_NEUF = parseString(columns[indexes[this.mapPropLabel['cOMITE_SITE_NEUF']]]);


      newObj.cHOIX_PROSPECT = parseString(columns[indexes[this.mapPropLabel['cHOIX_PROSPECT']]]);


      newObj.eNVOI_EB = parseString(columns[indexes[this.mapPropLabel['eNVOI_EB']]]);


      newObj.rEPONSE_EBS = parseString(columns[indexes[this.mapPropLabel['rEPONSE_EBS']]]);


      newObj.rEDACTION_DTB = parseString(columns[indexes[this.mapPropLabel['rEDACTION_DTB']]]);


      newObj.vALIDATION_DTB = parseString(columns[indexes[this.mapPropLabel['vALIDATION_DTB']]]);


      newObj.dEVIS_TS = parseString(columns[indexes[this.mapPropLabel['dEVIS_TS']]]);


      newObj.date_planifiee_confirmee_DEVIS_TS = parseString(columns[indexes[this.mapPropLabel['date_planifiee_confirmee_DEVIS_TS']]]);


      newObj.dOSSIER_INFORMATION_MAIRIE = parseString(columns[indexes[this.mapPropLabel['dOSSIER_INFORMATION_MAIRIE']]]);


      newObj.date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE = parseString(columns[indexes[this.mapPropLabel['date_de_Realisation_Jalon_ARA_DOSSIER_INFORMATION_MAIRIE']]]);


      newObj.dEPOT_ADMIN = parseString(columns[indexes[this.mapPropLabel['dEPOT_ADMIN']]]);


      newObj.date_de_Real_DEPOT_ADMIN = parseString(columns[indexes[this.mapPropLabel['date_de_Real_DEPOT_ADMIN']]]);


      newObj.aUTO_ADMIN = parseString(columns[indexes[this.mapPropLabel['aUTO_ADMIN']]]);


      newObj.date_planifiee_confirmee_AUTO_ADMIN = parseString(columns[indexes[this.mapPropLabel['date_planifiee_confirmee_AUTO_ADMIN']]]);


      newObj.cONTAINER_HW_Radio = parseString(columns[indexes[this.mapPropLabel['cONTAINER_HW_Radio']]]);


      newObj.cONTAINER_HW_Antenne = parseString(columns[indexes[this.mapPropLabel['cONTAINER_HW_Antenne']]]);


      newObj.cONTAINER_HW_FH = parseString(columns[indexes[this.mapPropLabel['cONTAINER_HW_FH']]]);


      newObj.dEMANDE_ENEDIS = parseString(columns[indexes[this.mapPropLabel['dEMANDE_ENEDIS']]]);


      newObj.dEVIS_ENEDIS = parseString(columns[indexes[this.mapPropLabel['dEVIS_ENEDIS']]]);


      newObj.sIGNATURE_CONVENTION = parseString(columns[indexes[this.mapPropLabel['sIGNATURE_CONVENTION']]]);


      newObj.gO_REALISATION = parseString(columns[indexes[this.mapPropLabel['gO_REALISATION']]]);


      newObj.date_de_Realisation_Jalon_ARA_GO_REALISATION = parseString(columns[indexes[this.mapPropLabel['date_de_Realisation_Jalon_ARA_GO_REALISATION']]]);


      newObj.date_planifiee_confirmee_GO_REALISATION = parseString(columns[indexes[this.mapPropLabel['date_planifiee_confirmee_GO_REALISATION']]]);


      newObj.mAD_INFRA = parseString(columns[indexes[this.mapPropLabel['mAD_INFRA']]]);


      newObj.date_planifiee_confirmee_MAD_INFRA = parseString(columns[indexes[this.mapPropLabel['date_planifiee_confirmee_MAD_INFRA']]]);


      newObj.mAD_ENEDIS_DEFINITIF = parseString(columns[indexes[this.mapPropLabel['mAD_ENEDIS_DEFINITIF']]]);


      newObj.date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF = parseString(columns[indexes[this.mapPropLabel['date_planifiee_confirmee_MAD_ENEDIS_DEFINITIF']]]);


      newObj.mES = parseString(columns[indexes[this.mapPropLabel['mES']]]);


      newObj.date_planifiee_confirmee_MES = parseString(columns[indexes[this.mapPropLabel['date_planifiee_confirmee_MES']]]);


      newObj.rECETTE = parseString(columns[indexes[this.mapPropLabel['rECETTE']]]);


      newObj.pARFAIT_ACHEVEMENT = parseString(columns[indexes[this.mapPropLabel['pARFAIT_ACHEVEMENT']]]);


      newObj.date_antenne = parseString(columns[indexes[this.mapPropLabel['date_antenne']]]);


}

// Importer un fichier CSV
readCSV(file: File) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const csv = e.target.result;
    const lines = csv.split('\n');
    const result: Antenne[] = [];

    // Ne pas importer la première ligne : extraire les names de colonnes
    const headerLine = lines[0];
    const headers = headerLine.split(sepCsv).map((header: string) => header.trim());

    // Vérifier que les names de colonnes du fichier correspondent à ceux attendus
    const expectedHeaders = tableLabels;

    console.log("headers=", headers)
    console.log("expectedHeaders=", expectedHeaders)

    if( ! this.validateHeaders(expectedHeaders, headers))  return ;

    const indexes: { [key: string]: number } = {};

    headers.forEach((header: string) => {
      indexes[header] = headers.indexOf(header)
    });

    // Parcourir chaque ligne du CSV (sauter la première ligne d'en-tête)
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if(!line) continue ;
      const row = line.split(sepCsv);

      // S'assurer que la ligne contient le bon nombre de colonnes
      // if (columns.length < expectedHeaders.length) continue;

      const newObj = new Antenne(); // Initialize an empty Antenne object

      this.initObjWithLine(newObj, row, indexes);

      // Appeler la méthode correcte selon le type d'import
      if (this.modeIncremental) {
        this.saveIncremental(newObj);
      } else {
        this.saveFull(newObj);
      }
    }

    this.importerInServer();
  };
  reader.readAsText(file, csvEncoding);

}

// Importer un fichier Excel (XLSX)
readExcel(file: File) {
  const reader = new FileReader();
  reader.onload = (e: any) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });

    // Sélectionner la première feuille de calcul
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];

    // Convertir la feuille en JSON, avec la première ligne en en-têtes (header: 1)
    const excelData: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    // Vérifier si les colonnes correspondent à celles attendues
    const expectedHeaders = tableLabels;

    // La première ligne du fichier Excel contient les names de colonnes
    const headers = excelData[0].map((header: string) => header.trim());

    if( ! this.validateHeaders(expectedHeaders, headers))  return ;

    const indexes: { [key: string]: number } = {};

    headers.forEach((header: string) => {
      indexes[header] = headers.indexOf(header)
    });

    // Parcourir chaque ligne des données Excel (en commençant après les en-têtes)
    for (let i = 1; i < excelData.length; i++) {
      const row = excelData[i];

      // Assurer que la ligne contient suffisamment de colonnes
      // if (row.length < expectedHeaders.length) continue;

      const newObj = new Antenne()

      this.initObjWithLine(newObj, row, indexes);

      // Appeler la méthode correcte selon le type d'import
      if (this.modeIncremental) {
        this.saveIncremental(newObj);
      } else {
        this.saveFull(newObj);
      }
    }

    this.importerInServer();
  };
  reader.readAsArrayBuffer(file);
}

// Sauvegarde incrémentale : Mise à jour ou ajout de l'utilisateur
saveIncremental(newObj: Antenne) {
  const existingUser = this.findByColUniq(newObj);

  if (existingUser) {

    tableProps.forEach((header: string) => {
      const key = header as keyof Antenne
      // Ici, nous devons faire une conversion explicite des types pour dire à TypeScript que
      // nous savons que les valeurs sont compatibles.
      (existingUser[key] as any) = newObj[key];
    });
  } else {
    // Ajouter un nouvel utilisateur si l'email n'existe pas
    this.myList.push(newObj);
  }
}

// Sauvegarde complète : Ajouter tous les utilisateurs (remplacement complet)
saveFull(newObj: Antenne) {
  this.myList.push(newObj); // Ajoute l'utilisateur à la table (remplacement complet)
}


}

// Utilitaires pour les valeurs par défaut en fonction du type
function parseNumber(value: string) {
  return Number(value) || 0;
}

function parseBoolean(value: string) {
  return value !== undefined ? Boolean(value) : false;
}

function parseString(value: any): string {
  if (value === null || value === undefined) {
    return ''; // Retourne une chaîne vide pour les valeurs null ou undefined
  }
  
  if (typeof value === 'string') {
    return value?.trim(); // Retourne la valeur si c'est déjà une chaîne
  }
  
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value); // Convertit un objet ou tableau en JSON stringifié
    } catch {
      return '[Object]'; // Gestion des cas où JSON.stringify échoue
    }
  }
  
  return String(value); // Convertit les autres types en chaîne
}