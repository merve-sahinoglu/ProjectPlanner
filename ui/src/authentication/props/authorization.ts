// eslint-disable-next-line max-classes-per-file
abstract class Authorization {
  static Facility = class {
    static readonly CAN_SEE = "101";

    static readonly CAN_DEFINE = "1011";

    static readonly CAN_EDIT = "1012";
  };

  static Location = class {
    static readonly CAN_SEE = "102";

    static readonly CAN_DEFINE = "1021";

    static readonly CAN_EDIT = "1022";
  };

  static Warehouse = class {
    static readonly CAN_SEE = "103";

    static readonly CAN_DEFINE = "1031";

    static readonly CAN_EDIT = "1032";
  };

  static Item = class {
    static readonly CAN_DEFINE = "2011";

    static readonly CAN_EDIT = "2012";
  };

  static Override = class {
    static readonly CAN_DEFINE = "2021";

    static readonly CAN_EDIT = "2022";
  };

  static ItemEquivalent = class {
    static readonly CAN_DEFINE = "2031";

    static readonly CAN_EDIT = "2032";
  };

  static ItemClass = class {
    static readonly CAN_DEFINE = "2041";

    static readonly CAN_EDIT = "2042";
  };

  static ItemGroup = class {
    static readonly CAN_DEFINE = "2051";

    static readonly CAN_EDIT = "2052";
  };

  static QuickList = class {
    static readonly CAN_DEFINE = "2061";

    static readonly CAN_EDIT = "2062";
  };

  static ItemPrescription = class {
    static readonly CAN_DEFINE = "2071";

    static readonly CAN_EDIT = "2072";
  };

  static Station = class {
    static readonly CAN_DEFINE = "3011";

    static readonly CAN_EDIT = "3012";
  };

  static StockCard = class {
    static readonly CAN_SEE_EQUIVALENT = "3021";
  };

  static OverrideWarehouseRelation = class {
    static readonly CAN_MATCH = "3031";

    static readonly CAN_ADD_ITEM = "3032";
  };

  static User = class {
    static readonly CAN_DEFINE = "4011";

    static readonly CAN_EDIT = "4012";
  };

  static ProfileGroup = class {
    static readonly CAN_DELETE_USER = "5016";

    static readonly CAN_DEFINE_USER = "5015";

    static readonly CAN_EDIT = "5012";

    static readonly CAN_DEFINE = "5011";

    static readonly CAN_DEFINE_AUTHORIZATION = "5013";

    static readonly CAN_EDIT_AUTHORIZATION = "5014";
  };

  static PatientOperations = class {
    static readonly CAN_SEE_PATIENT_LIST = "601";

    static readonly CAN_SEE_PATIENT_ORDER_LIST = "602";

    static readonly CAN_CHANGE_ORDER = "6021";
  };

  static OverrideReason = class {
    static readonly CAN_EDIT = "701";
  };

  static InventoryCount = class {
    static readonly CAN_SEE = "3071";

    static readonly CAN_CANCEL = "3072";
  };
}

export default Authorization;
