/* eslint-disable max-classes-per-file */
abstract class Log {
  static Event = class {
    static readonly AUTHENTICATION = 'AUTHENTICATION';

    static readonly BUTTON_PRESS = 'BUTTON_PRESS';

    static readonly SELECT_CHOICE = 'SELECT_CHOICE';

    static readonly CARD_SELECT = 'CARD_SELECT';

    static readonly DATABASE_ERROR = 'DATABASE_ERROR';

    static readonly PROCESS_QUEUE = 'PROCESS_QUEUE';

    static readonly SOCKET_COMMUNICATION = 'SOCKET_COMMUNICATION';

    static readonly UNHANDLED_EXCEPTION = 'UNHANDLED_EXCEPTION';
  };
}

export default Log;
