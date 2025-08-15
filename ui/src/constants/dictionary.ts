// eslint-disable-next-line max-classes-per-file
abstract class Dictionary {
  static User = class {
    static readonly TITLE = "user.modalsTitle";
    static readonly SELECT_FILE = "user.selectFile";
    static readonly RELATIVE = "user.relative";

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

    static readonly EXECUTIVE = "user.executive";

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

  static PlayGroup = class {
    static readonly TITLE = "playGroup.title";
    static readonly CARD_TITLE = "playGroup.cardTitle";
    static readonly NAME = "playGroup.name";
    static readonly MIN_AGE = "playGroup.minAge";
    static readonly MAX_AGE = "playGroup.maxAge";
    static readonly MAX_PARTICIPANTS = "playGroup.maxParticipants";
    static readonly PLAYGROUP_THERAPISTS = "playGroup.playgroupTherapists";
    static readonly IS_ACTIVE = "playGroup.isActive";

    static Validation = class {
      static readonly NAME_MIN = "playGroup.validation.nameMinimum";
      static readonly NAME_MAX = "playGroup.validation.nameMaximum";
      static readonly MIN_AGE_REQUIRED = "playGroup.validation.minAgeRequired";
      static readonly MAX_AGE_REQUIRED = "playGroup.validation.maxAgeRequired";
      static readonly MAX_PARTICIPANTS_REQUIRED =
        "playGroup.validation.maxParticipantsRequired";
      static readonly THERAPIST_REQUIRED =
        "playGroup.validation.therapistRequired";
    };
  };

  static PlaygroupTherapist = class {
    static readonly ID = "playgroupTherapist.id";
    static readonly THERAPIST_ID = "playgroupTherapist.therapistId";
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

  static Success = class {
    static readonly POSITIVE = "success.positive";

    static readonly NEGATIVE = "success.negative";

    static readonly RELATION_EXISTS = "success.itemRelationExists";
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

  static readonly Room = class {
    static readonly TITLE = "room.title";
    static readonly CARD_TITLE = "room.cardTitle";
    static readonly NAME = "room.name";
    static readonly DESCRIPTION = "room.description";
    static readonly MAX_CAPACITY = "room.maxCapacity";
    static readonly IS_AVAILABLE = "room.isAvailable";
    static readonly ROOM_TYPE_ID = "room.roomTypeId";
    static readonly ROOM_TYPE = "room.roomType";
    static readonly AMENITIES = "room.amenities";

    static Validation = class {
      static readonly NAME_MIN = "validation.room.nameMinimum";
      static readonly NAME_MAX = "validation.room.nameMaximum";
      static readonly DESCRIPTION_MIN = "validation.room.descriptionMinimum";
      static readonly DESCRIPTION_MAX = "validation.room.descriptionMaximum";
      static readonly MAX_CAPACITY_MIN = "validation.room.maxCapacityMinimum";
      static readonly MAX_CAPACITY_MAX = "validation.room.maxCapacityMaximum";
      static readonly ROOM_TYPE_ID_REQUIRED =
        "validation.room.roomTypeIdRequired";
      static readonly AMENITIES_REQUIRED = "validation.room.amenitiesRequired";
    };
  };

  static Appointment = class {
    static readonly CARD_TITLE = "appointment.cardTitle";
    static readonly ID = "appointment.id";
    static readonly DESCRIPTION = "appointment.description";
    static readonly APPOINTMENT_ID = "appointment.appointmentId";
    static readonly CHIELD_ID = "appointment.childId";
    static readonly PLAYGROUP_ID = "appointment.playgroupId";
    static readonly ROOM_ID = "appointment.roomId";
    static readonly THERAPIST_ID = "appointment.therapistId";
    static readonly TYPE_ID = "appointment.typeId";
    static readonly STATUS_ID = "appointment.statusId";
    static readonly TITLE = "appointment.title";
    static readonly START = "appointment.start";
    static readonly END = "appointment.end";
    static readonly ALL_DAY = "appointment.allDay";

    static Validation = class {
      static readonly APPOINTMENT_ID_REQUIRED =
        "validation.appointment.appointmentIdRequired";
      static readonly CHILD_ID_REQUIRED =
        "validation.appointment.childIdRequired";
      static readonly THERAPIST_ID_REQUIRED =
        "validation.appointment.therapistIdRequired";
      static readonly TYPE_ID_REQUIRED =
        "validation.appointment.typeIdRequired";
      static readonly STATUS_ID_REQUIRED =
        "validation.appointment.statusIdRequired";
      static readonly TITLE_MIN = "validation.appointment.titleMinimum";
      static readonly TITLE_MAX = "validation.appointment.titleMaximum";
      static readonly START_REQUIRED = "validation.appointment.startRequired";
      static readonly END_REQUIRED = "validation.appointment.endRequired";
    };
  };

  static AppointmentType = class {
    static readonly INITIAL_CONSULTATION =
      "appointmentType.initialConsultation";
    static readonly SPEECH_THERAPY = "appointmentType.speechTherapy";
    static readonly PSYCHOLOGICAL_THERAPY =
      "appointmentType.psychologicalTherapy";
    static readonly GAME_GROUPS = "appointmentType.gameGroups";
  };


}
export default Dictionary;
