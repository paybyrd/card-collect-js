// all types below based on https://www.verygoodsecurity.com/docs/api/collect/ documentation and should be removed after VGS will add their own types

export type VGSState = {
  /**
   * Checks if you put any changes to the field
   */
  isDirty: boolean;
  /**
   * Shows if the field in a focus right now
   */
  isFocused: boolean;
  /**
   * Shows field validity
   */
  isValid: boolean;
  /**
   * Determines whether the field is empty
   */
  isEmpty: boolean;
  /**
   * Turns true when the user blurs the field for the first time
   */
  isTouched: boolean;
  /**
   * An array of error messages for a specific field
   */
  errorMessages: string[];
  /**
   * Available for card number and ssn fields only. Shows the last 4 digits
   */
  last4: string;
  /**
   * Available for the card number field only. Shows card bin number once the number is valid
   */
  bin: string;
  /**
   * Available for the card number field only. type of credit card brand (e.g 'visa', 'mestercard', 'amex' etc.).
   * Full list of supported card brands you can find [here](vgs-collect/js/customization#card-brand-identification)
   */
  cardType: string;
};

type VGSValidation =
  | "required"
  | "validCardNumber"
  | "validCardNumberExtended"
  | "validCardNumberLuhnCheck"
  | "validCardSecurityCode"
  | "validCardExpirationDate"
  | "compareValue"
  | RegExp;

type VGSBrand =
  | "visa"
  | "visaelectron"
  | "maestro"
  | "mastercard"
  | "amex"
  | "discover"
  | "dankort"
  | "dinersclub"
  | "jcb"
  | "unionpay"
  | "forbrugsforeningen"
  | "elo"
  | "hipercard";

export type VGSProperties = {
  /**
   * Name of the input field. Will be shown in the form state and used as a data key in the request payload
   */
  name: string;
  /**
   * Type of the input field.
   */
  type:
    | "card-number"
    | "card-security-code"
    | "card-expiration-date"
    | "ssn"
    | "password"
    | "text"
    | "zip-code"
    | "postal-code"
    | "file"
    | "dropdown"
    | "checkbox";
  /**
   * allows controlling how the browser should populate a given form field.
   */
  autoComplete?:
    | "cc-name"
    | "cc-number"
    | "cc-csc"
    | "cc-exp"
    | "name"
    | "email"
    | "tel"
    | "shipping street-address"
    | "shipping locality"
    | "shipping region"
    | "shipping postal-code"
    | "shipping country"
    | String;
  /**
   * An object of styles you can apply to the field.
   */
  css?: object;
  /**
   * Attribute that hints at the type of data that might be entered by the user while editing the element or its contents. This allows a browser to display an appropriate virtual keyboard.
   */
  inputMode?: ElementContentEditable["inputMode"];
  /**
   * CSS classes that are applied to the container element when the field is in a particular state.
   */
  classes?: Partial<{
    /**
     * the field is not valid
     */
    invalid: string;
    /**
     * the field is empty
     */
    empty: string;
    /**
     * the field is focused
     */
    focused: string;
    /**
     * interaction with the field happened
     */
    dirty: string;
    /**
     * the field has ever gained and lost focus
     */
    touched: string;
  }>;
  readOnly?: boolean;
  /**
   * Specifies that the input field should automatically get focused when the page loads.
   */
  autoFocus?: boolean;
  /**
   * Specifies that the input field is disabled.
   */
  disabled?: boolean;
  /**
 *  Is used to define a string that labels the current element. By default, each field
    has its own aria-label value, but you can redefine it and specify the purpose for better accessibility.
 */
  ariaLabel?: string;
  /**
   * Change the format of the value being sent to the server.
   */
  serializers?: (
    | { name: "replace"; options: { old: string; new: string; count?: number } }
    | { name: "separate"; options: { monthName: string; yearName: string } }
    | { name: "toBase64" }
  )[];
  /**
   * Change the default tokenization format. This applies only when the request goes to the Tokenization API otherwise is controlled in the Inbound Route filters.
   * Field tokenization can be disabled by assigning value to the `false` in this case the value will be returned as a raw format (exceptions are card number/cvv and ssn fields).
   * More about tokenization formats you can read [here](vgs-collect/js/collect-tokenization-api#setup-tokenization-formats).
   */
  tokenization?: {
    format: string;
    storage: string;
  };
  validations?: VGSValidation[];
  errors?: object[];
  /**
   * Placeholder text.
   */
  placeholder?: string;
  /**
   * Small card icon will be shown on the right side of an input field. The icon will be changed based on the card brand.
   */
  showCardIcon?: boolean;
  /**
   * Unfortunately, we cannot use regular HTTP(s) URLs for security reasons. To customise an icon you need to pass a [Data URL](https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/Data_URIs) with an icon
   */
  icons?: Partial<
    Record<"cardPlaceholder" | "cvvFront" | "cvvBack" | VGSBrand, string>
  >;
  addCardBrands?: {
    type: string;
    /**
     * Custom card validation pattern
     */
    pattern: RegExp;
    /**
     * Mask for the input (e.g. split value with spaces)
     * @default /(\d{1,4})/g
     */
    format?: RegExp;
    /**
     * Card number length
     * @default [16]
     */
    length?: number[];
    /**
     * Available CVC number length
     * @default [3,4]
     */
    cvcLength?: number[];
    /**
     * Specify whether card should pass luhn check or not
     * @default true
     */
    luhn?: boolean;
  }[];
  validCardBrands?: { type: VGSBrand }[];
  /**
   * Use it if you would like to hide entered value to prevent shoulder surfing attacks.
   */
  hideValue?: boolean;
  /**
   * Control the length of the year we send to the server. If none is specified by default we accept both formats.
   */
  yearLength?: 2 | 4;
};

type VGSEnterPressData = {
  name: string;
};

type VGSSubmitOptions = {
  /**
   * Additional data you want to pass along with VGS Collect.js field values. To merge form values with an existing payload structure you can use data as a callback function. It receives an object where keys are all available field names, once the form is submitted Collect.js will securely replace placeholders with actual values.
   */
  data?: object | ((formValues: Record<string, string>) => object);
  /**
   * HTTP method.
   */
  method?: string;
  serialization?: "json" | "formData";
  /**
   * HTTP headers to be added to the request.
   */
  headers?: object;
  /**
   * Indicates whether or not cross-site Access-Control requests should be made using credentials such as cookies, authorization headers, or TLS client certificates. false by default.
   */
  withCredentials?: boolean;
};

type VGSFocusFieldEvent = "focus" | "blur";

type VGSKeyboardFieldEvent = "keyup" | "keydown" | "keypress";

type VGSFocusEventData = {
  type: string;
  timeStamp: number;
  isTrusted: boolean;
};

type VGSKeyboardEventData = {
  type: string;
  timeStamp: number;
  isTrusted: boolean;
  key: string | null;
  keyCode: number | null;
  which: number | null;
  metaKey: boolean;
  ctrlKey: boolean;
  keyIndex: number;
  valueHidden: boolean;
};

export type VGSField = {
  /**
   * Subscribe to events related to the specific form field.
   * @param event - Field events
   * @param callback - A function to execute each time the event is triggered.
   */
  on(
    event: VGSFocusFieldEvent,
    callback: (event: VGSFocusEventData) => void
  ): void;
  on(
    event: VGSKeyboardFieldEvent,
    callback: (event: VGSKeyboardEventData) => void
  ): void;
  on(event: "update", callback: (fieldState: any) => void): void;
  on(event: "delete", callback: () => void): void;
  /**
   * Unsubscribe from events related to the specific form field.
   * @param event - Field events
   * @param callback - A function to execute each time the event is triggered.
   */
  off(
    event: VGSFocusFieldEvent,
    callback: (event: VGSFocusEventData) => void
  ): void;
  off(
    event: VGSKeyboardFieldEvent,
    callback: (event: VGSKeyboardEventData) => void
  ): void;
  off(event: "update", callback: (fieldState: any) => void): void;
  off(event: "delete", callback: () => void): void;
  /**
   * Dynamic update of the form field properties.
   * @param properties - List of properties that can be updated
   */
  update(
    properties: Pick<
      VGSProperties,
      | "validations"
      | "placeholder"
      | "ariaLabel"
      | "css"
      | "hideValue"
      | "autoComplete"
      | "disabled"
      | "showCardIcon"
      | "readOnly"
    >
  ): void;
  /**
   * Reset the form fields value.
   */
  reset(): void;
  /**
   * Remove iframe from the DOM and from the form state.
   */
  delete(): void;
  /**
   * Constrain user input. This method is available for those type of Collect fields: `text`, `textarea`, `password`, `zip-code`.
   * @param mask - Mask string. Default format characters are: `9: [0-9]`, `a: [A-Za-z]`, `*: [A-Za-z0-9]`.
   * @param maskChar - Character to cover unfilled parts of the mask. By default - `null`.
   * @param formatChar - Defines format characters with characters as keys and corresponding RegExp strings as a value.
   */
  mask(mask: string, maskChar?: string | null, formatChar?: object): void;
  /**
   * The method returns a new string with some or all matches of a pattern replaced by a replacement. It will modify the value as the user type in the input field. This method is available for those type of the fields: `text`, `textarea`, `password`, `zip-code`.
   * @param regExpString - A RegExp object or literal. The match or matches are replaced with a new sub string.
   * @param newSubStr - The string that replaces the substring specified by the regExp. By default - empty string.
   */
  replacePattern(regExpString: string, newSubStr?: string): void;
  loadingState: "loading" | "loaded" | "failed";
  promise: Promise<void>;
};

type VGSForm = {
  /**
   * Configure secure input field. VGS Collect creates one iframe per input field.
   * @param selector - CSS selector that points to the DOM element where the iframe will be added.
   * @param properties - Field properties.
   */
  field(selector: string, properties?: VGSProperties): VGSField;
  /**
   * Specify your CNAME. If specified the data will go through the cname instead of the vault url. Please make sure you have activated CNAME on the Dashboard.
   * @param cname CNAME domain
   */
  useCname(cname: string): VGSForm;
  /**
   * Listen to events that are related to the whole form state.
   * @param event - Event type.
   * @param callback - A function to execute each time the event is triggered. The information contains the field name from where submit action was triggered.
   */
  on(event: "enterPress", callback: (info: VGSEnterPressData) => void): void;
  /**
   * Unsubscribe from the form event listeners.
   * @param event - Event type.
   * @param callback - A function to execute each time the event is triggered.
   */
  off(event: "enterPress", callback: (info: VGSEnterPressData) => void): void;
  /**
   * Unmount the Collect form from the DOM.
   */
  unmount(): void;
  /**
   * Reset the form.
   */
  reset(): void;
  /**
   * Send a request to your server through our Inbound proxy.
   * @param path - The upstream server endpoint where the data will be submitted to.
   * @param options - HTTP request additional configuration.
   * @param responseCallback - The callback function that returns request status and response data.
   * @param validationCallback - Provides information about invalid fields if any.
   */
  submit(
    path: string,
    options: VGSSubmitOptions,
    responseCallback: (status: number, response: any) => void,
    errorCallback: (errors: Record<string, any>) => void
  ): void;
  /**
   * On the form submit HTTP request from the Collect form goes to the [Tokenization API](tokenization/typescript-tutorial) `/tokens` endpoint. The request payload is preconfigured and no additional data can be sent.
   * @param responseCallback - Callback function returns response status and data.
   * @param validationCallback - Form validation callback. Provides information about invalid fields.
   */
  tokenize(
    responseCallback: (status: number, response: any) => void,
    errorCallback: (errors: Record<string, any>) => void
  ): void;
};

export type VGSCollect = {
  /**
   * Create VGS Collect instance
   * @param vaultId - VGS organization unique vault id value HTTP request from the Collect form will go through.
   * @param environment - Vault environment: `sandbox`, `live` or one with specified data region
   * @param stateCallback - You have an access to the form state object which provides useful information about fields condition.
   */
  create(
    vaultId: string,
    environment: string,
    stateCallback?: (state: Record<string, VGSState>) => void
  ): VGSForm;
};
