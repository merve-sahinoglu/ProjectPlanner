// eslint-disable-next-line max-classes-per-file
abstract class Dictionary {
  static User = class {
    static readonly TITLE = "user.modalsTitle";

    static readonly CARD_TITLE = "user.cardTitle";

    static readonly USERNAME = "user.userName";

    static readonly NAME = "user.name";

    static readonly SURNAME = "user.surname";

    static readonly USER_TITLE = "user.title";

    static readonly BIRTH_DATE = "user.birthDate";

    static readonly GENDER = "user.gender";

    static readonly EMAIL = "user.email";

    static readonly CARD_NUMBER = "user.cardNumber";

    static readonly STATUS = "user.isActive";

    static readonly PERMISSIONS = "user.permissions";

    static readonly USER_WAREHOUSE_RELATION = "user.userWarehouseRelation";

    static readonly APP = "user.app";

    static readonly MODULE = "user.module";

    static readonly FUNCTION = "user.function";

    static readonly USER_PERMISSIONS = "user.userPermissions";

    static readonly PERMISSION_TIME = "user.permissionTime";

    static readonly ACCOUNT = "user.account";

    static readonly PROFILE = "user.profile";

    static readonly LANGUAGE = "user.language";

    static readonly LOGOUT = "user.logout";

    static readonly USER_LIST = "user.userList";

    static readonly GENDER_UNKNOWN = "user.genderUnknown";

    static readonly GENDER_MALE = "user.genderMale";

    static readonly GENDER_FEMALE = "user.genderFemale";

    static readonly GENDER_OTHER = "user.genderOther";

    static readonly CREATE_ONE_TIME_PASSWORD = "user.createOneTimePassword";

    static readonly ONE_TIME_PASSWORD_MODAL_TEXT =
      "user.oneTimePasswordModalText";

    static readonly ONE_TIME_PASSWORD_MODAL_TITLE =
      "user.oneTimePasswordModalTitle";

    static readonly PASSWORD = "user.password";

    static readonly USER_AUTHORIZATION = "user.userAuthorization";

    static readonly USER_FACILITIES = "user.userFacility";

    static readonly DELETE_FINGERPRINT = "user.deleteFingerprint";

    static readonly DELETE_FINGERPRINT_MODAL_TEXT =
      "user.deleteFingerprintModalText";

    static readonly HIS_USER_ID = "user.hisUserId";

    static readonly CHANGE_PASSWORD = "user.changePassword";

    static readonly BIO = "user.bio";

    static readonly MANAGE_INFORMATION = "user.manageInformation";

    static readonly PASSWORD_REGEX = "user.passwordRegex";

    static readonly CURRENT_PASSWORD = "user.currentPassword";

    static Validation = class {
      static readonly NAME_MIN = "validation.user.nameMinimum";

      static readonly NAME_MAX = "validation.user.nameMaximum";

      static readonly USERNAME_MIN = "validation.user.userNameMinimum";

      static readonly USERNAME_MAX = "validation.user.userNameMaximum";

      static readonly SURNAME_MIN = "validation.user.surnameMinimum";

      static readonly SURNAME_MAX = "validation.user.surnameMaximum";

      static readonly EMAIL = "validation.user.email";

      static readonly EMAIL_MAX = "validation.user.emailMax";

      static readonly TITLE_MIN = "validation.user.titleMinimum";

      static readonly TITLE_MAX = "validation.user.titleMaximum";

      static readonly CARD_MIN = "validation.user.cardMinimum";

      static readonly CARD_MAX = "validation.user.cardMaximum";

      static readonly PASSWORD_MIN = "validation.user.passMinimum";

      static readonly PASSWORD_MAX = "validation.user.passMaximum";

      static readonly PASSWORDS_DONT_MATCH =
        "validation.user.passwordsDontMatch";
    };
  };

  static Patient = class {
    static readonly PATIENT_LIST = "patient.patientList";

    static readonly PATIENT_CODE = "patient.patientCode";

    static readonly PATIENT_NAME = "patient.patientName";

    static readonly PATIENT_SURNAME = "patient.patientSurname";

    static readonly ORDER_DATE = "patient.orderDate";

    static readonly ORDER_QUANTITY = "patient.orderQuantity";

    static readonly ORDER_TYPE = "patient.orderType";

    static readonly SEARCH_EQUIVALENT = "patient.searchEquivalent";

    static readonly COLD_CHAIN_PATIENT_DRUG = "patient.coldChainPatientDrug";

    static readonly PATIENT_DRUG = "patient.patientDrug";

    static readonly ORDER_NOTE = "patient.orderNote";

    static readonly URGENT = "patient.urgent";

    static readonly ON_REQUIREMENT = "patient.onRequirement";

    static readonly SCHEDULED = "patient.scheduled";

    static readonly ORDER_EQUIVALENT_CHANGE = "patient.orderEquivalentChange";

    static readonly PENDING = "patient.pending";

    static readonly CANCELLED = "patient.cancelled";

    static readonly ADMINISTERED = "patient.administered";

    static readonly EXTERNALLY_APPLIED = "patient.applied";

    static readonly EXTERNALLY_NOT_APPLIED = "patient.notApplied";

    static readonly ALL = "patient.all";

    static readonly STATUS = "patient.status";

    static readonly PROTOCOL_NO = "patient.protocolNo";

    static readonly USED_ORDER_CAN_NOT_CHANGE = "patient.orderCanNotChange";

    static readonly STOPPED_ORDER_CAN_NOT_CHANGE =
      "patient.stoppedOrderCanNotChange";

    static readonly ORDER_NO = "patient.orderNo";

    static readonly START_DATE = "patient.startDate";

    static readonly STOP_DATE = "patient.stopDate";

    static readonly ORDER_DETAIL = "patient.orderDetail";

    static readonly OVERRIDE_ORDER = "patient.overrideOrder";
  };

  static StockCard = class {
    static readonly MIN_ALERT_QUANTITY = "stockCard.minAlertQuantity";

    static readonly MIN_QUANTITY = "stockCard.minQuantity";

    static readonly MAX_QUANTITY = "stockCard.maxQuantity";

    static readonly EXPIRY_DATE = "stockCard.expiryDate";

    static readonly STOCK_CARD_SEARCH = "stockCard.search";

    static readonly IN_STOCK = "stockCard.inStock";

    static readonly STATUS = "stockCard.status";

    static readonly STOCK_CARD_FILTER = "stockCard.filter";
  };

  static Validation = class {
    static Input = class {
      static readonly MIN = "validation.inputValidation.min";

      static readonly MAX = "validation.inputValidation.max";
    };

    static List = class {
      static readonly ALREADY_IN_LIST =
        "validation.listValidation.alreadyInList";

      static readonly INVALID_ITEM = "validation.listValidation.invalidItem";

      static readonly SELECT = "validation.listValidation.select";
    };
  };

  static Entity = class {
    static readonly LOCATION = "entity.location";

    static readonly ITEM = "entity.item";

    static readonly FACILITY = "entity.facility";

    static readonly ITEMCLASS = "entity.itemClass";

    static readonly ITEMGROUP = "entity.itemGroup";

    static readonly ITEMPRESCRIPTION = "entity.itemPrescription";

    static readonly KIT = "entity.kit";

    static readonly OVERRIDE = "entity.override";

    static readonly STATION = "entity.station";

    static readonly USER = "entity.user";

    static readonly WAREHOUSE = "entity.warehouse";

    static readonly EQUIVALENT_ITEM = "entity.equivalentItem";

    static readonly SUB_GROUP_CODE_EXISTS = "entity.subGroupCode";

    static readonly SUB_GROUP_NAME_EXISTS = "entity.subGroupName";

    static readonly REASON = "entity.reason";
  };

  static Warehouse = class {
    static readonly LABEL = "warehouse.label";

    static readonly LABEL_DESCRIPTION = "warehouse.labelDescription";

    static readonly LABEL_DESCRIPTION_USER = "warehouse.labelDescriptionUser";

    static readonly SEARCH_PLACEHOLDER = "warehouse.searchPlaceholder";

    static readonly NAME = "warehouse.name";

    static readonly CODE = "warehouse.code";

    static readonly STATUS = "warehouse.status";

    static readonly CREATE_USER = "warehouse.createUser";

    static readonly ORDER_MANAGEMENT = "warehouse.orderManagement";

    static readonly TITLE = "warehouse.title";

    static readonly DETAIL = "warehouse.detail";

    static readonly SUCCESS = "warehouse.success";

    static readonly WAREHOUSE_TYPE_DRUG = "warehouse.drug";

    static readonly WAREHOUSE_TYPE_CONSUMABLE = "warehouse.consumable";

    static readonly ITEM_GROUP = "warehouse.itemGroup";

    static readonly WAREHOUSE_SEARCH_DESCRIPTION =
      "warehouse.warehouseSearchDescription";

    static readonly PATIENT_MANAGEMENT = "warehouse.patientManagement";

    static readonly ALL_PATIENT_MANAGEMENT = "warehouse.allPatientManagement";

    static Validation = class {
      static readonly NAME_MIN = "validation.warehouse.nameMinimum";

      static readonly NAME_MAX = "validation.warehouse.nameMaximum";

      static readonly CODE_MIN = "validation.warehouse.codeMinimum";

      static readonly CODE_MAX = "validation.warehouse.codeMaximum";

      static readonly ITEM_GROUP_NULL = "validation.warehouse.itemGroupNull";
    };
  };

  static Facility = class {
    static readonly CARD_TITLE = "facility.cardTitle";

    static readonly NAME = "facility.name";

    static readonly TITLE = "facility.title";

    static readonly DEFINITION = "facility.definition";

    static readonly CODE = "facility.code";
  };

  static ProfileGroup = class {
    static readonly APPLICATION = "profileGroup.application";

    static readonly PROFILE_GROUP_LIST = "profileGroup.profileGroupList";

    static readonly CREATE_DATE = "profileGroup.createDate";

    static readonly ADDED_DATE = "profileGroup.addedDate";

    static readonly ADDED_BY = "profileGroup.addedBy";

    static readonly PROFILE_NAME = "profileGroup.profileName";

    static readonly PROFILE_DEFINITION = "profileGroup.profileGroupDefinition";

    static readonly PROFILE_USER_RELATION =
      "profileGroup.profileGroupUserRelation";

    static readonly ADMIN = "profileGroup.admin";

    static readonly DEVICE = "profileGroup.device";

    static readonly PROFILE_GROUP_SEARCH = "profileGroup.profileGroupSearch";

    static Validation = class {
      static readonly NAME_MIN = "validation.profileGroup.nameMin";

      static readonly NAME_MAX = "validation.profileGroup.nameMax";

      static readonly APP_SHOULD_SELECTED =
        "validation.profileGroup.applicationSelected";
    };
  };

  static Station = class {
    static readonly NAME = "station.name";

    static readonly STATUS = "station.status";

    static readonly STATION_IP = "station.ip";

    static readonly FINGERPRINT_LOGIN = "station.fingerprintLogin";

    static readonly FACILITY = "station.facility";

    static readonly STATION_TYPE = "station.stationType";

    static readonly COMMUNICATION_BRAND = "station.communicationBrand";

    static readonly WITNESS_METHOD = "station.witnessMethod";

    static readonly ACTIVE = "station.active";

    static readonly PERSONNEL_CARD_LOGIN = "station.personelCardLogin";

    static readonly USERNAME_LOGIN = "station.usernameLogin";

    static readonly NONE = "station.none";

    static readonly MAIN_STATION = "station.mainStation";

    static readonly WALL_STATION = "station.wallStation";

    static readonly TITLE = "station.title";

    static readonly COUNT_FREQUENCY = "station.countFrequency";

    static readonly CARD_TITLE = "station.cardTitle";

    static readonly MIGRATION_STATUS = "station.migrationStatus";

    static readonly START_MIGRATION = "station.startMigration";

    static readonly PENDING = "station.pending";

    static readonly SUCCESS = "station.success";

    static readonly FAILED = "station.failed";

    static readonly SETUP_NOT_COMPLETED = "station.setupNotCompleted";

    static readonly MIGRATION_RECORD_CREATED = "station.migrationRecordCreated";

    static readonly MULTIPLE_PATIENT_DRUG = "station.isMultiplePatientDrug";

    static Validation = class {
      static readonly NAME_MIN = "validation.station.nameMinimum";

      static readonly NAME_MAX = "validation.station.nameMaximum";

      static readonly IP = "validation.station.ip";
    };
  };

  static Location = class {
    static readonly CARD_TITLE = "location.cardTitle";

    static readonly NAME = "location.name";

    static readonly CODE = "location.code";

    static readonly LABEL = "location.label";

    static readonly LABEL_DESCRIPTION = "location.labelDescription";

    static readonly SEARCH_PLACEHOLDER = "location.searchPlaceholder";

    static readonly TITLE = "location.title";

    static readonly ACTIVE = "location.active";

    static readonly FACILITY = "location.facility";

    static readonly CREATE_USER = "location.createUser";

    static readonly DEFINITION_TITLE = "location.definitionTitle";

    static Validation = class {
      static readonly CODE_MIN = "validation.location.locationCodeMinimum";

      static readonly CODE_MAX = "validation.location.locationCodeMaximum";

      static readonly NAME_MIN = "validation.location.locationNameMinimum";

      static readonly NAME_MAX = "validation.location.locationNameMaximum";
    };
  };

  static InputValidation = class {
    static readonly MIN = "validation.inputValidation.min";

    static readonly MAX = "validation.inputValidation.max";

    static readonly MAX_NUMBER = "validation.inputValidation.maxNumber";
  };

  static Item = class {
    static readonly CODE = "item.code";

    static readonly NAME = "item.name";

    static readonly UOM = "item.uom";

    static readonly TITLE = "item.title";

    static readonly ACTIVE = "item.active";

    static readonly HIGH_RISK = "item.highRisk";

    static readonly ORDER_DESCRIPTION = "item.orderDescription";

    static readonly NARCOTIC = "item.narcotic";

    static readonly SUB_ITEM_GROUP = "item.subItemGroup";

    static readonly PRESCRIPTIONTYPE = "item.prescriptionType";

    static readonly WITNESS_COUNT = "item.witnessCount";

    static readonly IS_WITNESS_REQUIRED = "item.isWitnessRequired";

    static readonly MULTIPLE_DOSE = "item.multipleDose";

    static readonly EFFICIENT_MATERIAL = "item.efficientMaterial";

    static readonly COLD_CHAIN_DRUG = "item.coldChainDrug";

    static readonly CARD_TITLE = "item.cardTitle";

    static readonly MIGHT_NEED_WITNESS = "item.mightNeedWitness";

    static readonly IS_RETURN_TO_RETURN_BOX = "item.isReturnToReturnBox";

    static readonly BARCODE_DESCRIPTION = "item.barcodeDescription";

    static readonly ITEM_FACILITY_PROPERTIES = "item.itemFacilityProperties";

    static readonly CHARGEABLE = "item.chargeable";

    static Validation = class {
      static readonly CODE_MIN = "validation.drug.codeMinimum";

      static readonly CODE_MAX = "validation.drug.codeMaximum";

      static readonly NAME_MIN = "validation.drug.nameMinimum";

      static readonly NAME_MAX = "validation.drug.nameMaximum";

      static readonly SUB_ITEM_GROUP_NULL = "validation.drug.itemGroupNull";

      static readonly EFFICIENT_MATERIAL_NULL =
        "validation.drug.efficientMaterialId";

      static readonly MAIN_ITEM_GROUP_NULL = "validation.drug.mainItemGroupId";

      static readonly PRESCRIPTION_TYPE_NULL =
        "validation.drug.prescriptionTypeId";

      static readonly ITEM_GROUP_TYPE_NULL = "validation.drug.itemGroup";
    };
  };

  static Consumable = class {
    static readonly CODE = "consumable.code";

    static readonly NAME = "consumable.name";

    static readonly TITLE = "consumable.title";

    static readonly ACTIVE = "consumable.active";

    static readonly SUBITEMGROUP = "consumable.itemGroup";

    static readonly MAIN_ITEMGROUP = "consumable.mainItemGroup";

    static readonly DUMMY = "consumable.dummy";

    static Validation = class {
      static readonly CODE_MIN = "validation.consumable.codeMinimum";

      static readonly CODE_MAX = "validation.consumable.codeMaximum";

      static readonly NAME_MIN = "validation.consumable.nameMinimum";

      static readonly NAME_MAX = "validation.consumable.nameMaximum";

      static readonly MAIN_ITEM_GROUP_NULL =
        "validation.consumable.mainItemGroupNull";

      static readonly SUB_ITEM_GROUP_NULL =
        "validation.consumable.itemGroupNull";
    };
  };

  static ItemClassification = class {
    static readonly NAME = "itemClassification.name";

    static readonly ACTIVE = "itemClassification.isActive";

    static readonly TITLE = "itemClassification.title";

    static readonly CARD_TITLE = "itemClassification.cardTitle";

    static Validation = class {
      static readonly ITEM_CLASSIFICATION_NAME_MIN =
        "validation.itemClassification.itemClassificationNameMinimum";
    };
  };

  static ItemPrescription = class {
    static readonly CODE = "itemPrescription.code";

    static readonly NAME = "itemPrescription.name";

    static readonly STATUS = "itemPrescription.isActive";

    static readonly TITLE = "itemPrescription.title";

    static readonly CARD_TITLE = "itemPrescription.cardTitle";

    static Validation = class {
      static readonly CODE_MIN =
        "validation.itemPrescription.prescriptionCodeMinimum";

      static readonly CODE_MAX =
        "validation.itemPrescription.prescriptionCodeMaximum";

      static readonly NAME_MIN =
        "validation.itemPrescription.prescriptionNameMinimum";

      static readonly NAME_MAX =
        "validation.itemPrescription.prescriptionNameMaximum";
    };
  };

  static ItemEquivalent = class {
    static readonly CODE = "itemEquivalent.code";

    static readonly NAME = "itemEquivalent.name";

    static readonly FACTOR_QUANTITY = "itemEquivalent.factorQuantity";

    static readonly STATUS = "itemEquivalent.isActive";

    static readonly CARD_TITLE = "itemEquivalent.cardTitle";

    static readonly EQUIVALENT_TO_CARD_TITLE =
      "itemEquivalent.equivalentItemCardTitle";

    static readonly EQUIVALENT_ITEM_SEARCH =
      "itemEquivalent.equivalentItemSearch";

    static readonly FACTOR_QUANTITY_CANNOT_BE_ZERO =
      "itemEquivalent.factorQuantityCannotBeZero";
  };

  static ItemGroup = class {
    static readonly CODE = "itemGroup.code";

    static readonly DESCRIPTION = "itemGroup.name";

    static readonly IS_MEDICINE = "itemGroup.isMedicine";

    static readonly IS_CONSUMABLE = "itemGroup.isConsumable";

    static readonly STATUS = "itemGroup.isActive";

    static readonly CREATE_USER = "itemGroup.createUser";

    static readonly CREATE_DATE = "itemGroup.createDate";

    static readonly CARD_TITLE = "itemGroup.cardTitle";

    static readonly TITLE = "itemGroup.title";

    static readonly RELATION = "itemGroup.relation";

    static Validation = class {
      static readonly CODE_MIN =
        "validation.itemGroup.mainItemGroupCodeMinimum";

      static readonly CODE_MAX =
        "validation.itemGroup.mainItemGroupCodeMaximum";

      static readonly NAME_MIN =
        "validation.itemGroup.mainItemGroupNameMinimum";

      static readonly NAME_MAX =
        "validation.itemGroup.mainItemGroupNameMaximum";
    };
  };

  static SubItemGroup = class {
    static readonly CODE = "subItemGroup.code";

    static readonly DESCRIPTION = "subItemGroup.name";

    static readonly STATUS = "subItemGroup.isActive";

    static Validation = class {
      static readonly CODE_MIN = "validation.itemGroup.itemGroupCodeMinimum";

      static readonly CODE_MAX = "validation.itemGroup.itemGroupCodeMaximum";

      static readonly NAME_MIN = "validation.itemGroup.itemGroupNameMinimum";

      static readonly NAME_MAX = "validation.itemGroup.itemGroupNameMaximum";
    };
  };

  static Kit = class {
    static readonly CODE = "kit.code";

    static readonly NAME = "kit.name";

    static readonly ACTIVE = "kit.active";

    static readonly ITEM_QUANTITY = "kit.itemQuantity";

    static readonly TITLE = "kit.title";

    static readonly CARD_TITLE = "kit.cardTitle";

    static Validation = class {
      static readonly CODE_MIN = "validation.kit.kitCodeMinimum";

      static readonly CODE_MAX = "validation.kit.kitCodeMaximum";

      static readonly NAME_MIN = "validation.kit.kitNameMinimum";

      static readonly NAME_MAX = "validation.kit.kitNameMaximum";

      static readonly QUANTITY_MIN = "validation.kit.kitItemQuantityMinimum";

      static readonly ITEM_KIT_RELATION =
        "validation.kit.kitItemRelationExists";
    };
  };

  static ActionBar = class {
    static readonly DEFINE = "actionBar.define";

    static readonly DELETE = "actionBar.delete";

    static readonly FILTER = "actionBar.filter";

    static readonly REPORT = "actionBar.report";

    static readonly REFRESH = "actionBar.refresh";
  };

  static DataGrid = class {
    static readonly LAST_REFRESHED = "dataGrid.lastRefreshed";

    static readonly PAGINATION = "dataGrid.pagination";

    static readonly ACTIONS = "dataGrid.actions";

    static readonly NO_RECORDS = "dataGrid.noRecords";
  };

  static CardGrid = class {
    static readonly RESULTS = "cardGrid.results";

    static readonly PAGINATION = "cardGrid.pagination";

    static readonly FILTER = "cardGrid.filter";

    static readonly SEARCH_INPUT = "cardGrid.searchInput";

    static readonly SHOW_ALL = "cardGrid.showAll";

    static readonly SHOW_ACTIVES = "cardGrid.showActives";
  };

  static Button = class {
    static readonly CANCEL = "button.cancel";

    static readonly DEFINE = "button.define";

    static readonly EDIT = "button.edit";

    static readonly SAVE = "button.save";

    static readonly ADD = "button.add";

    static readonly YES = "button.yes";

    static readonly NO = "button.no";

    static readonly DELETE = "button.delete";

    static readonly EXCEL = "button.excel";

    static readonly CLOSE = "button.close";

    static readonly GENERATE = "button.generate";

    static readonly PRINT = "button.print";

    static readonly CLEAR = "button.clear";
  };

  static Stepper = class {
    static readonly FIRST_STEP = "stepper.firstStep";

    static readonly SECOND_STEP = "stepper.secondStep";

    static readonly WAREHOUSE_DEFINITION = "stepper.warehouseDefinition";

    static readonly WAREHOUSE_LOCATION_MATCH = "stepper.warehouseLocationMatch";
  };

  static Header = class {
    static readonly SEARCH_LABEL = "header.searchLabel";
  };

  static Login = class {
    static readonly USERNAME = "login.userName";

    static readonly PASSWORD = "login.password";

    static readonly FACILITY = "login.facility";

    static readonly LOGIN = "login.login";

    static Validation = class {
      static readonly NAME_MIN = "validation.login.nameMinimum";

      static readonly NAME_MAX = "validation.login.nameMaximum";

      static readonly PASS_MIN = "validation.login.passwordMinimum";

      static readonly PASS_MAX = "validation.login.passwordMaximum";
    };
  };

  static Error = class {
    static NotFound = class {
      static readonly TITLE = "error.notFound.title";

      static readonly DESCRIPTION = "error.notFound.description";

      static readonly BUTTON_LABEL = "error.notFound.buttonLabel";
    };

    static UnderConstruction = class {
      static readonly TITLE = "error.underConstruction.title";

      static readonly DESCRIPTION = "error.underConstruction.description";
    };

    static Forbidden = class {
      static readonly TITLE = "error.forbidden.title";

      static readonly DESCRIPTION = "error.forbidden.description";

      static readonly BUTTON_LABEL = "error.forbidden.buttonLabel";
    };
  };

  static Override = class {
    static readonly NAME = "override.name";

    static readonly TITLE = "override.title";

    static readonly CARD_TITLE = "override.cardTitle";

    static readonly ACTIVE = "override.active";

    static readonly DRUG_LIST = "override.drugList";

    static readonly SEARCH_FOR_DRUGS = "override.drugSearch";

    static readonly ADD_DRUG = "override.addDrug";

    static readonly OVERRIDE_REASONS = "override.overrideReasons";

    static readonly REASON = "override.reason";

    static readonly OVERRIDE_REASON = "override.overrideReason";

    static readonly ITEMS_WILL_BE_DELETED = "override.itemsWillBeDeleted";

    static readonly ITEMS_WILL_BE_ADDED = "override.itemsWillBeAdded";

    static Validation = class {
      static readonly NAME_MIN = "validation.overrideItem.overrideNameMinimum";

      static readonly NAME_MAX = "validation.overrideItem.overrideNameMaximum";

      static readonly SELECT_DRUG = "validation.overrideItem.selectDrug";

      static readonly REASON_REQUIRED =
        "validation.overrideItem.reasonRequired";
    };
  };

  static Reports = class {
    static readonly STATION_ERROR_LOG = "reports.stationErrorLog";

    static readonly STOCK_CONTROL = "reports.stockControl";

    static readonly NO_TRANSACTION_ITEM = "reports.noTransactionItems";

    static readonly CANNOT_SELECT_ALL_STATIONS_WITHOUT_ITEM =
      "reports.cannotSelectAllStationsWithoutItem";

    static readonly CANNOT_BIGGER_THAN_END_DAY =
      "reports.cannotBiggerThanEndDay";

    static readonly END_DATE = "reports.endDate";

    static readonly START_DATE = "reports.startDate";

    static readonly SELECT_STATION = "reports.selectStation";

    static readonly MAIN_GROUP = "reports.mainGroup";

    static readonly SELECT_MAIN_GROUP = "reports.selectMainGroup";

    static readonly LAST_X_DAYS = "reports.lastXDays";

    static readonly EXCEL = "reports.excel";

    static readonly SELECT_WAREHOUSE = "reports.selectWarehouse";

    static readonly STOCK_TRANSACTION = "reports.stockTransaction";

    static readonly UNDER_MIN = "reports.underMin";

    static readonly SELECT_TRANSACTION_TYPE = "reports.selectTransactionType";

    static readonly SELECT_STATUS = "reports.selectStatus";

    static readonly SELECT_REPORT_TYPE = "reports.selectReportType";

    static readonly MORE_THAN_MAX = "reports.moreThanMax";

    static readonly SELECT_LAST_X_DAYS = "reports.selectLastXDays";
  };

  static Success = class {
    static readonly POSITIVE = "success.positive";

    static readonly NEGATIVE = "success.negative";

    static readonly RELATION_EXISTS = "success.itemRelationExists";
  };

  static MainPanel = class {
    static readonly DEFINITIONS = "mainPanel.definitions";

    static readonly ITEM_MANAGEMENT = "mainPanel.itemManagementMenu";

    static readonly SYSTEM_ADMIN = "mainPanel.systemAdminMenu";

    static readonly PATIENT_OPERATIONS = "mainPanel.patientOperations";

    static readonly USER_MANAGEMENT = "mainPanel.userManagementMenu";

    static readonly REPORTS_AND_MONITORING = "mainPanel.reportsAndMonitoring";

    static readonly STATION_MANAGEMENT = "mainPanel.stationDefinitionMenu";

    static readonly OVERRIDE_LIST_MATCH = "mainPanel.overrideListMatchTitle";

    static readonly ITEM_EQUIVALENT_TITLE = "mainPanel.itemEquivalentTitle";

    static readonly STOCK_CARD_TITLE = "mainPanel.stockCardTitle";

    static readonly STOCK_CARD_DESCRIPTION = "mainPanel.stockCardDescription";

    static readonly COUNT_MANGEMENT_TITLE = "mainPanel.countManagementTitle";

    static readonly COUNT_MANAGEMENT_DESCRIPTION =
      "mainPanel.countManagementDescription";

    static readonly WAREHOUSE_DEFINITION_TITLE =
      "mainPanel.warehouseDefinitionTitle";

    static readonly WAREHOUSE_DEFINITION_DESCRIPTION =
      "mainPanel.warehouseDefinitionDescription";

    static readonly LOCATION_MANAGEMENT_TITLE =
      "mainPanel.locationManagementTitle";

    static readonly LOCATION_MANAGEMENT_DESCRIPTION =
      "mainPanel.locationManagementDescription";

    static readonly STATION_MANAGEMENT_TITLE =
      "mainPanel.stationManagementTitle";

    static readonly STATION_MANAGEMENT_DESCRIPTION =
      "mainPanel.stationManagementDescription";

    static readonly DRUG_MANAGEMENT_TITLE = "mainPanel.drugManagementTitle";

    static readonly DRUG_MANAGEMENT_DESCRIPTION =
      "mainPanel.drugManagementDescription";

    static readonly CONSUMABLE_MANAGEMENT_TITLE =
      "mainPanel.consumableManagementTitle";

    static readonly CONSUMABLE_MANAGEMENT_DESCRIOPTION =
      "mainPanel.consumableManagementDescription";

    static readonly PRESCRIPTION_TYPE_MANAGEMENT_TITLE =
      "mainPanel.prescriptionTypeManagementTitle";

    static readonly PRESCRIPTION_TYPE_MANAGEMENT_DESCRIPTION =
      "mainPanel.prescriptionTypeManagementDescription";

    static readonly ITEM_GROUP_MANAGEMENT_TITLE =
      "mainPanel.itemGroupManagementTitle";

    static readonly ITEM_GROUP_MANAGEMENT_DESCRIPTION =
      "mainPanel.itemGroupManagementDescription";

    static readonly OVERRIDE_ITEM_MANAGEMENT_TITLE =
      "mainPanel.overrideItemManagementTitle";

    static readonly OVERRIDE_ITEM_MANAGEMENT_DESCRIPTION =
      "mainPanel.overrideItemManagementDescription";

    static readonly KIT_MANAGEMENT_TITLE = "mainPanel.kitManagementTitle";

    static readonly KIT_MANAGEMENT_DESCRIPTION =
      "mainPanel.kitManagementDescription";

    static readonly DRUG_CLASS_MANAGEMENT_TITLE =
      "mainPanel.drugClassManagementTitle";

    static readonly DRUG_CLASS_MANAGEMENT_DESCRIPTION =
      "mainPanel.drugClassManagementDescription";

    static readonly OVERRIDE_REASON_MANAGEMENT_DESCRIPTION =
      "mainPanel.itemEquivalentTitle";

    static readonly WAREHOUSE_MANAGEMENT_TITLE =
      "mainPanel.warehouseManagementTitle";

    static readonly USER_MANAGEMENT_TITLE = "mainPanel.userManagementTitle";

    static readonly USER_MANAGEMENT_DESCRIPTION =
      "mainPanel.userManagementDescription";

    static readonly PROFILE_GROUP_MANAGEMENT_TITLE =
      "mainPanel.profileGroupManagementTitle";

    static readonly PROFILE_GROUP_MANAGEMENT_DESCRIPTION =
      "mainPanel.profileGroupManagementDescription";

    static readonly ITEM_MANAGEMENT_TITLE = "mainPanel.itemManagementTitle";

    static readonly ITEM_MANAGEMENT_DESCRIPTION =
      "mainPanel.itemManagementDescription";

    static readonly STATION_FILLING_REPORT_TITLE =
      "mainPanel.reportStationFillingTitle";

    static readonly STATION_FILLING_REPORT_DESCRIPTION =
      "mainPanel.reportStationFillingDescription";

    static readonly STOCK_TRANSACTION_REPORT_TITLE =
      "mainPanel.reportStockTransactionTitle";

    static readonly STOCK_TRANSACTION_REPORT_DESCRIPTION =
      "mainPanel.reportStockTransactionDescription";

    static readonly STOCK_CONTROL_REPORT_TITLE =
      "mainPanel.reportStockControlTitle";

    static readonly STOCK_CONTROL_REPORT_DESCRIPTION =
      "mainPanel.reportStockControlDescription";

    static readonly PHYSICAL_COUNT_REPORT_TITLE =
      "mainPanel.reportPhysicalCountTitle";

    static readonly PHYSICAL_COUNT_REPORT_DESCRIPTION =
      "mainPanel.reportPhysicalCountDescription";

    static readonly INSTANT_COUNT_REPORT_TITLE =
      "mainPanel.reportInstantCountTitle";

    static readonly INSTANT_COUNT_REPORT_DESCRIPTION =
      "mainPanel.reportInstantCountDescription";

    static readonly UNDER_MIN_REPORT_TITLE = "mainPanel.reportUnderMinTitle";

    static readonly UNDER_MIN_REPORT_DESCRIPTION =
      "mainPanel.reportUnderMinDescription";

    static readonly NONMOVING_ITEM_REPORT_TITLE =
      "mainPanel.reportNonMovingItemTitle";

    static readonly NONMOVING_ITEM_REPORT_DESCRIPTION =
      "mainPanel.reportNonMovingItemDescription";

    static readonly COMPONENT_TRANSACTION_REPORT_TITLE =
      "mainPanel.reportComponentTransactionTitle";

    static readonly COMPONENT_TRANSACTION_REPORT_DESCRIPTION =
      "mainPanel.reportComponentTransactionDescription";

    static readonly STATION_COMPONENT_FAILURE_REPORT_TITLE =
      "mainPanel.reportStationComponentFailureTitle";

    static readonly STATION_COMPONENT_FAILURE_REPORT_DESCRIPTION =
      "mainPanel.reportStationComponentFailureDescription";

    static readonly CRITICAL_STOCK_LEVEL_REPORT_TITLE =
      "mainPanel.reportCriticalStockLevelReportTitle";

    static readonly CRITICAL_STOCK_LEVEL_REPORT_DESCRIPTION =
      "mainPanel.reportCriticalStockLevelReportDescription";

    static readonly DASHBOARD = "mainPanel.dashboard";

    static readonly COUNT_MATCH = "mainPanel.countMatchTitle";

    static readonly WITNESS_MATCH = "mainPanel.witnessMatchTitle";

    static readonly KIT_MATCH = "mainPanel.kitMatchTitle";

    static readonly OVERRIDE_REASON = "mainPanel.overrideReasonTitle";

    static readonly IMPORT_STOCK_CARD_TITLE = "mainPanel.importStockCardTitle";
  };

  static Popup = class {
    static readonly NOT_SAVED_TITLE = "popup.notSaved.title";

    static readonly NOT_SAVED_DESCRIPTION = "popup.notSaved.description";

    static readonly MODIFICATION_NOT_SAVED_TITLE =
      "popup.modificationNotSaved.title";

    static readonly MODIFICATION_NOT_SAVED_DESCRIPTION =
      "popup.modificationNotSaved.description";

    static readonly DELETE_TITLE = "popup.delete.title";

    static readonly DELETE_DESCRIPTION = "popup.delete.description";
  };

  static General = class {
    static readonly STATUS = "general.status";

    static readonly DATE_OF_BIRTH = "general.dateOfBirth";

    static readonly ALL = "general.all";

    static readonly PASSIVE = "general.passive";

    static readonly ACTIVE = "general.active";
  };

  static Authorization = class {
    static readonly CANT_ACCESS = "authorization.cantAccess";
  };

  static Exception = class {
    static readonly SESSION_EXPIRED = "exception.sessionExpired";
  };

  static StationProfile = class {
    static readonly LOAD = "stationProfile.load";

    static readonly UNLOAD = "stationProfile.unload";

    static readonly TAKE = "stationProfile.take";

    static readonly RETURN = "stationProfile.return";

    static readonly COUNT = "stationProfile.count";

    static readonly STOCK_CARD = "stationProfile.stockCard";

    static readonly MAINTENANCE = "stationProfile.maintenance";
  };

  static FillOrder = class {
    static readonly CARD_TITLE = "fillReport.title";

    static readonly DRAFT = "fillReport.draft";

    static readonly CREATING = "fillReport.creating";

    static readonly PENDING = "fillReport.pending";

    static readonly CANCELLED = "fillReport.cancelled";

    static readonly DONE = "fillReport.done";

    static readonly ONGOING = "fillReport.ongoing";

    static readonly UNDER_MIN = "fillReport.underMin";

    static readonly UNDER_MAX = "fillReport.underMax";

    static readonly OUT_OF_STOCK = "fillReport.outOfStock";

    static readonly NO = "fillReport.no";

    static readonly DATE = "fillReport.date";

    static readonly ITEM_COUNT = "fillReport.itemCount";

    static readonly ORDER_TYPE = "fillReport.orderType";

    static readonly NO_FILTER_ITEM = "fillReport.noFilterItem";

    static readonly SELECT_STATION = "fillReport.selectStation";

    static readonly CANT_EDIT_CANCELLED = "fillReport.cantEditCancel";

    static readonly NEW_ORDER = "fillReport.newOrder";

    static readonly STOCK_ADDRESS = "fillReport.stockAddress";

    static readonly MIN_QTY = "fillReport.minimumQuantity";

    static readonly MAX_QTY = "fillReport.maximumQuantity";

    static readonly STOCK_QTY = "fillReport.stockQuantity";

    static readonly CREATE_ORDER = "fillReport.createOrder";

    static readonly DELETE_ORDER = "fillReport.deleteOrder";

    static readonly ORDER_QTY = "fillReport.orderQuantity";

    static readonly LOAD_QTY = "fillReport.fillingQuantity";

    static readonly ALL = "fillReport.all";

    static readonly NARCOTIC = "fillReport.narcotic";

    static readonly OTHERS = "fillReport.others";

    static readonly SAVE_AS_DRAFT = "fillReport.saveAsDraft";

    static readonly SEND_ORDER = "fillReport.sendOrder";

    static readonly EDIT_AND_SEND_ORDER = "fillReport.editOrder";

    static readonly PHARMACY_STOCK_ADDRESS = "fillReport.pharmacyStockAddress";
  };

  static readonly OneTimePassword = class {
    static readonly CREATE_PASSWORD = "oneTimePassword.createPassword";

    static readonly APPROVE_PASSWORD = "oneTimePassword.approvePassword";

    static readonly NOT_NULL = "oneTimePassword.notNull";

    static readonly MUST_BETWEEN = "oneTimePassword.mustBetween";

    static readonly DIFFERENT_PASSWORD = "oneTimePassword.differentPassword";

    static readonly SAME_PASSWORD = "oneTimePassword.samePassword";
  };

  static readonly UserAuthorizations = class {
    static readonly DEFINE_FACILITY = "userAuthorizations.defineFacility";

    static readonly EDIT_FACILITY = "userAuthorizations.editFacility";

    static readonly DEFINE_LOCATION = "userAuthorizations.defineLocation";

    static readonly EDIT_LOCATION = "userAuthorizations.editLocation";

    static readonly DEFINE_WAREHOUSE = "userAuthorizations.defineWarehouse";

    static readonly EDIT_WAREHOUSE = "userAuthorizations.editWarehouse";

    static readonly DEFINE_ITEM = "userAuthorizations.defineItem";

    static readonly EDIT_ITEM = "userAuthorizations.editItem";

    static readonly DEFINE_ITEM_CLASSIFICATION =
      "userAuthorizations.defineItemClassification";

    static readonly EDIT_ITEM_CLASSIFICATION =
      "userAuthorizations.editItemClassification";

    static readonly DEFINE_ITEM_GROUP = "userAuthorizations.defineItemGroup";

    static readonly EDIT_ITEM_GROUP = "userAuthorizations.editItemGroup";

    static readonly DEFINE_PRESCRIPTION_TYPE =
      "userAuthorizations.definePrescriptionType";

    static readonly EDIT_PRESCRIPTION_TYPE =
      "userAuthorizations.editPrescriptionType";

    static readonly DEFINE_OVERRIDE_LIST =
      "userAuthorizations.defineOverrideList";

    static readonly EDIT_OVERRIDE_LIST = "userAuthorizations.editOverrideList";

    static readonly DEFINE_QUICK_LIST = "userAuthorizations.defineQuickList";

    static readonly EDIT_QUICK_LIST = "userAuthorizations.editQuickList";

    static readonly DEFINE_EQUIVALENT = "userAuthorizations.defineEquivalent";

    static readonly EDIT_EQUIVALENT = "userAuthorizations.editEquivalent";

    static readonly DEFINE_OVERRIDE_REASON =
      "userAuthorizations.defineOverrideReason";

    static readonly EDIT_OVERRIDE_REASON =
      "userAuthorizations.editOverrideReason";

    static readonly DEFINE_STATION = "userAuthorizations.defineStation";

    static readonly EDIT_STATION = "userAuthorizations.editStation";

    static readonly DISPLAY_EQUIVALENT_STOCK =
      "userAuthorizations.displayEquivalentStock";

    static readonly MAPPING_QUICK_LIST = "userAuthorizations.mappingQuickList";

    static readonly EDIT_QUICK_LIST_WAREHOUSE =
      "userAuthorizations.editQuickListOnWarehouse";

    static readonly COUNT_MATCH_EDIT = "userAuthorizations.countMatchEdit";

    static readonly OVERRIDE_ITEM_WAREHOUSE_MAP =
      "userAuthorizations.overrideItemWarehouseMap";

    static readonly EDIT_OVERRIDE_ITEM_WAREHOUSE =
      "userAuthorizations.editOverrideItemsOnWarehouse";

    static readonly DEFINE_LOAD_REPORT = "userAuthorizations.defineLoadReport";

    static readonly DEFINE_USER = "userAuthorizations.defineUser";

    static readonly EDIT_USER = "userAuthorizations.editUser";

    static readonly USER_WAREHOUSE_MAP =
      "userAuthorizations.userWarehouseMapping";

    static readonly DEFINE_PROFILE_GROUP =
      "userAuthorizations.defineProfileGroup";

    static readonly EDIT_PROFILE_GROUP_AUTHORITY =
      "userAuthorizations.editProfileGroupAuthority";

    static readonly DEFINE_USER_TO_PROFILE_GROUP =
      "userAuthorizations.defineUserToProfileGroup";

    static readonly DELETE_USER_PROFILE_GROUP_MAP =
      "userAuthorizations.deleteMappedProfileGroupUser";

    static readonly DISPLAY_PATIENT_LIST =
      "userAuthorizations.displayPatientList";

    static readonly DISPLAY_PATIENT_ORDER =
      "userAuthorizations.displayPatientOrders";

    static readonly CHANGE_WITH_EQUIVALENT =
      "userAuthorizations.changeWithEquivalent";

    static readonly DISPLAY_MAIN_PANEL = "userAuthorizations.displayMainPanel";

    static readonly CHARGE_INTEGRATION = "userAuthorizations.chargeIntegration";

    static readonly EDIT_PROFILE_GROUP = "userAuthorizations.editProfileGroup";

    static readonly FACILITY_DEFINITION_TITLE =
      "userAuthorizations.facilityDefinitionTitle";

    static readonly WAREHOUSE_DEFINITION_TITLE =
      "userAuthorizations.warehouseDefinitionTitle";

    static readonly LOCATION_DEFINITION_TITLE =
      "userAuthorizations.locationDefinitionTitle";

    static readonly CAN_IMPORT_STOCK_CARD =
      "userAuthorizations.canImportStockCard";
  };

  static readonly CountMapping = class {
    static readonly LOAD = "countMapping.fill";

    static readonly DISCHARGE = "countMapping.discharge";

    static readonly TAKE = "countMapping.take";

    static readonly RETURN = "countMapping.return";
  };

  static StockTransaction = class {
    static readonly FILLING = "stockTransaction.filling";

    static readonly DISCHARGE = "stockTransaction.discharge";

    static readonly COUNT = "stockTransaction.count";

    static readonly STOCK_ADJUSTMENT = "stockTransaction.stockAdjustment";

    static readonly CHARGE = "stockTransaction.charge";

    static readonly RETURN = "stockTransaction.return";
  };

  static InventoryCount = class {
    static readonly COUNT_DATE = "inventoryCount.countDate";

    static readonly TOTAL_COUNT = "inventoryCount.totalCount";

    static readonly NARCOTIC_COUNT = "inventoryCount.narcoticCount";

    static readonly COUNT_DIFFERENCE = "inventoryCount.countDifference";

    static readonly NARCOTIC_COUNT_DIFFERENCE =
      "inventoryCount.narcoticDifference";

    static readonly CANCEL_COUNT = "inventoryCount.cancelCount";

    static readonly USER = "inventoryCount.user";

    static readonly COMPLETED_COUNTS = "inventoryCount.completedCounts";

    static readonly ACTIVE_COUNTS = "inventoryCount.activeCounts";

    static readonly CANCELLED_COUNTS = "inventoryCount.cancelledCounts";

    static readonly COUNT_NOT_YET_STARTED =
      "inventoryCount.notYetStartedCounts";

    static readonly CARD_TITLE = "inventoryCount.cardTitle";

    static readonly COUNT = "inventoryCount.count";

    static readonly COUNTED_AGAIN = "inventoryCount.countedAgain";

    static readonly COUNT_QUANTITY = "inventoryCount.countQuantity";

    static readonly STOCK_QUANTITY = "inventoryCount.stockQuantity";

    static readonly STOCK = "inventoryCount.stock";

    static readonly DIFFERENCE = "inventoryCount.difference";

    static readonly NARCOTIC_COUNTED_AGAIN =
      "inventoryCount.narcoticCountedAgain";

    static readonly COUNT_MOVEMENT = "inventoryCount.countMovements";

    static readonly SELECT_COUNT = "inventoryCount.selectCount";

    static readonly NO_COUNT_FOUND = "inventoryCount.noCountFound";
  };

  static Component = class {
    static readonly STATION = "component.station";

    static readonly CELL = "component.cell";

    static readonly SEPERATOR = "component.seperator";

    static readonly DRAWER = "component.drawer";

    static readonly CABINET = "component.cabinet";

    static readonly CABINET_COVER = "component.cabinetCover";

    static readonly FREEZER = "component.freezer";

    static readonly RETURN_BOX = "component.returnBox";
  };

  static ExcelImport = class {
    static readonly INCORRECT_FORMAT = "excelImport.incorrectFormat";

    static readonly SELECT_FILE = "excelImport.selectFile";

    static readonly CREATE_DRAFT = "excelImport.createDraft";

    static Validation = class {
      static readonly MIN_MAX_VALIDATION =
        "excelImport.validation.minCannotBeGreaterThanMax";

      static readonly SAME_LOCATION_SELECTED =
        "excelImport.validation.sameLocationHasSelected";
    };
  };
}
export default Dictionary;
