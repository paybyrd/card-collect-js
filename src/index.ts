import { loadVGSCollect } from "@vgs/collect-js";
import { VGSCollect, VGSField } from "./vgsTypes";
import { FieldOptions, CardCollectResponse, CardCollectOptions } from "./types";

declare const VGS_CNAME: string;
declare const VGS_VAULTID: string;
declare const VGS_ENV: string;
const VGS_CODE_KEY = "_cgnsT7sJuepFWXSIqgPSBT3WObz22FP5A4g3mNJ9Ny7AzFuZG4R3w==";

function noop() {}

export default async function CardCollect({
  onStateChanged,
}: CardCollectOptions = {}) {
  const collect = (await loadVGSCollect({
    vaultId: VGS_VAULTID,
    environment: VGS_ENV,
    version: "2.15.0",
  })) as VGSCollect;

  const form = collect
    .create(VGS_VAULTID, VGS_ENV, onStateChanged || noop)
    .useCname(VGS_CNAME);

  const fields: VGSField[] = [];

  const field = ({ id, ...options }: FieldOptions) => {
    if (!id) {
      throw new Error("You must pass a field id");
    }

    fields.push(form.field(id, options));
  };

  const cardNumber = (
    options: Omit<FieldOptions, "type" | "name" | "validations">
  ) => {
    field({
      ...options,
      type: "card-number",
      name: "card_number",
      validations: ["required", "validCardNumber"],
    });
  };

  const expirationDate = (
    options: Omit<
      FieldOptions,
      "type" | "name" | "validations" | "serializers" | "yearLength"
    >
  ) => {
    field({
      ...options,
      type: "card-expiration-date",
      name: "card_exp",
      validations: ["required", "validCardExpirationDate"],
      serializers: [{ name: "replace", options: { old: " ", new: "" } }],
      yearLength: 2,
    });
  };

  const cvv = (
    options: Omit<FieldOptions, "type" | "name" | "validations">
  ) => {
    field({
      ...options,
      type: "card-security-code",
      name: "card_cvv",
      validations: ["required", "validCardSecurityCode"],
    });
  };

  const holder = (
    options: Omit<FieldOptions, "type" | "name" | "validations">
  ) => {
    field({
      ...options,
      type: "text",
      name: "card_holder",
      validations: ["required"],
    });
  };

  const mount = (callback: (isSuccessful: boolean) => void = noop) =>
    Promise.all(fields.map((field) => field.promise))
      .then(() => {
        callback(true);
      })
      .catch(() => {
        callback(false);
      });

  const unmount = () => {
    form.unmount();
  };

  const submit = (/*additionalData*/) =>
    new Promise<CardCollectResponse>((resolve, reject) =>
      form.submit(
        `api/v1/tokens`,
        {
          data(formValues) {
            //let additionalFields = {};

            /* if (additionalData) {
						if (typeof additionalData === "function") {
							const tempAdditionalFields = additionalData();
							if (typeof tempAdditionalFields === "object") {
								additionalFields = tempAdditionalFields;
							}
						} else if (typeof additionalData === "object") {
							additionalFields = additionalData;
						}
					} */

            if (!formValues["card_number"]) {
              throw new Error("You have to provide a card number");
            }

            if (!formValues["card_exp"]) {
              throw new Error("You have to provide a card expiration date");
            }

            return {
              //...additionalFields,
              number: formValues["card_number"],
              expiration: formValues["card_exp"],
              cvv: formValues["card_cvv"],
              holder: formValues["card_holder"],
            };
          },
          headers: {
            "x-functions-key": VGS_CODE_KEY,
          },
        },
        (status, data) => {
          if (status === 201) {
            resolve({ status, data });
          } else {
            reject({ status, data });
          }
        },
        reject
      )
    );

  return {
    cardCollect_field: field,
    cardCollect_card_number: cardNumber,
    cardCollect_expiration_date: expirationDate,
    cardCollect_cvv: cvv,
    cardCollect_holder: holder,
    cardCollect_mount: mount,
    cardCollect_unmount: unmount,
    cardCollect_submit: submit,
  };
}

export { CardCollect as cardCollect };

export type { FieldOptions, CardCollectResponse, CardCollectOptions };
