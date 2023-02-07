import { VGSProperties, VGSState } from "./vgsTypes";

export type FieldOptions = { id: string } & VGSProperties;

export type CardCollectResponse = {
  status: number;
  data: { tokenId: string; offerKey: string };
};

export type CardCollectOptions = {
  onStateChanged?(
    state: Record<
      "card_number" | "card_exp" | "card_cvv" | "card_holder",
      VGSState
    >
  ): void;
};
