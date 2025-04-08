import {
  type ConsensusCommitee,
  type LintekCommitee,
  type StuffCommitee,
} from "../utils/interfaces";

type Committee<
  T,
  D extends "LinTek" | "Consensus" | "StuFF" | "Övrigt",
> = Record<
  string,
  {
    name: T;
    id: string;
    color: string;
    kår: D;
    hidden?: boolean;
    textColor?: "black";
  }
>;

export const committeesLinTek: Committee<LintekCommitee, "LinTek"> = {
  "102d533f-a760-4a4e-9746-b67d3e64b49a": {
    name: "CM",
    id: "102d533f-a760-4a4e-9746-b67d3e64b49a",
    color: "#009516",
    kår: "LinTek",
  },
  "18ad0dcb-509d-4f89-9594-7cc5a1fba177": {
    name: "GF",
    id: "18ad0dcb-509d-4f89-9594-7cc5a1fba177",
    color: "#A10E41",
    kår: "LinTek",
  },
  "22f1835e-ba60-4427-a2a1-5c99f04b13c5": {
    name: "MPiRE",
    id: "22f1835e-ba60-4427-a2a1-5c99f04b13c5",
    color: "#990A0A",
    kår: "LinTek",
  },
  "50da68e4-f9cb-4542-a092-5d4abd224ee8": {
    name: "Mytheriet",
    id: "50da68e4-f9cb-4542-a092-5d4abd224ee8",
    color: "#BF40BF",
    kår: "LinTek",
  },
  "97584aca-276a-4fb8-98f4-82947f3c5e35": {
    name: "STABEN",
    id: "97584aca-276a-4fb8-98f4-82947f3c5e35",
    color: "#d51000",
    kår: "LinTek",
  },
  "3c5331e6-13a8-4445-a4eb-a4d84054e395": {
    name: "TackLING",
    id: "3c5331e6-13a8-4445-a4eb-a4d84054e395",
    color: "#9D25CA",
    kår: "LinTek",
  },
  "8d413659-a663-467d-84a0-415c53751817": {
    name: "TEKKEN",
    id: "8d413659-a663-467d-84a0-415c53751817",
    color: "#FF0000",
    kår: "LinTek",
    hidden: true,
  },
  "850e6ab4-e900-4f34-a593-0361bb0451a6": {
    name: "URF",
    id: "850e6ab4-e900-4f34-a593-0361bb0451a6",
    color: "#166516",
    kår: "LinTek",
  },
  "be4ba79b-ed9a-43dd-8270-780c87eaac5d": {
    name: "YF",
    id: "be4ba79b-ed9a-43dd-8270-780c87eaac5d",
    color: "#000000",
    kår: "LinTek",
  },
};

export const committeesConsensus: Committee<ConsensusCommitee, "Consensus"> = {
  "e7ccfc17-e26e-4361-916d-edfafdd8adfc": {
    name: "ATtityd",
    id: "e7ccfc17-e26e-4361-916d-edfafdd8adfc",
    color: "#923d1d",
    kår: "Consensus",
  },
  "b12f72e9-5e93-4099-bf27-bc2bc4bf84a6": {
    name: "BMA",
    id: "b12f72e9-5e93-4099-bf27-bc2bc4bf84a6",
    color: "#d05126",
    kår: "Consensus",
  },
  "91005ff2-030d-41ca-8b3e-788ea5161cae": {
    name: "BioMed Master",
    id: "91005ff2-030d-41ca-8b3e-788ea5161cae",
    color: "#5a8fc2",
    kår: "Consensus",
    hidden: true,
  },
  "3d5b8981-76cf-4393-8d4b-32cac5af3f1d": {
    name: "HuvudFadderiet",
    id: "3d5b8981-76cf-4393-8d4b-32cac5af3f1d",
    color: "#619a23",
    kår: "Consensus",
  },
  "fbd81a9d-089b-45e4-8f15-27615db603c8": {
    name: "KraFTen",
    id: "fbd81a9d-089b-45e4-8f15-27615db603c8",
    color: "#0096FF",
    kår: "Consensus",
  },
  "119a52cc-e084-4dcd-be8c-f86b93d08ff3": {
    name: "Logoped",
    id: "119a52cc-e084-4dcd-be8c-f86b93d08ff3",
    color: "#c2e839",
    kår: "Consensus",
  },
  "5f16f50d-247b-4396-ab8e-83dc9704de27": {
    name: "ORGANisationen",
    id: "5f16f50d-247b-4396-ab8e-83dc9704de27",
    color: "#f6ba79",
    kår: "Consensus",
  },
  "267321c4-da56-4439-ab44-cf834004d587": {
    name: "Super Faddrarna",
    id: "267321c4-da56-4439-ab44-cf834004d587",
    color: "#b87c6e",
    kår: "Consensus",
  },
  "c1c83d9b-1840-456a-b875-ed0002b94a86": {
    name: "Welcoming Committee",
    id: "c1c83d9b-1840-456a-b875-ed0002b94a86",
    color: "#00b90f",
    kår: "Consensus",
    hidden: true,
  },
  "eccecf17-cf9f-43fb-982f-9550122c6596": {
    name: "Stemcellen",
    id: "eccecf17-cf9f-43fb-982f-9550122c6596",
    color: "#00b90f",
    kår: "Consensus",
  },
};

const committeesStuff: Committee<StuffCommitee, "StuFF"> = {
  "9efac5f6-a2f7-4c18-85c5-d0bc59c31f11": {
    name: "FBI",
    id: "9efac5f6-a2f7-4c18-85c5-d0bc59c31f11",
    color: "#c27d60",
    kår: "StuFF",
  },
  "2421ffec-03f3-464f-88ed-3d1efe8471d9": {
    name: "FOUL",
    id: "2421ffec-03f3-464f-88ed-3d1efe8471d9",
    color: "#556b2f",
    kår: "StuFF",
  },
  "baa89548-490f-4087-bd9e-f4852299a8d4": {
    name: "Freud",
    id: "baa89548-490f-4087-bd9e-f4852299a8d4",
    color: "#7382c4",
    kår: "StuFF",
  },
  "6e5decbe-706d-4455-b3de-2011b3d2b266": {
    name: "HRarkiet",
    id: "6e5decbe-706d-4455-b3de-2011b3d2b266",
    color: "#83dc13",
    kår: "StuFF",
  },
  "bf506d1c-bf9d-4afc-a927-3d0c0d567a9c": {
    name: "Jur6",
    id: "bf506d1c-bf9d-4afc-a927-3d0c0d567a9c",
    color: "#45d0e9",
    kår: "StuFF",
  },
  "4c0a71b8-c2fd-4fca-9843-a0c3502559fe": {
    name: "Kognitivet",
    id: "4c0a71b8-c2fd-4fca-9843-a0c3502559fe",
    color: "#7f4ae2",
    kår: "StuFF",
  },
  "c24ebb4e-c678-42a1-b0db-b9098c5b18c5": {
    name: "KoMPaSS",
    id: "c24ebb4e-c678-42a1-b0db-b9098c5b18c5",
    color: "#6fe9c3",
    kår: "StuFF",
  },
  "516318e5-c141-42c4-8c61-ded355172e4c": {
    name: "Players",
    id: "516318e5-c141-42c4-8c61-ded355172e4c",
    color: "#e88115",
    kår: "StuFF",
  },
  "df9952da-c20f-430d-955b-b855b97c06cb": {
    name: "SCB",
    id: "df9952da-c20f-430d-955b-b855b97c06cb",
    color: "#72e8b3",
    kår: "StuFF",
  },
  "3ce231c0-986c-41ac-8f19-b1b029865f20": {
    name: "SM",
    id: "3ce231c0-986c-41ac-8f19-b1b029865f20",
    color: "#ec3cd4",
    kår: "StuFF",
  },
  "4e782b03-7b3c-4b93-b2db-5272d587fd71": {
    name: "SPan",
    id: "4e782b03-7b3c-4b93-b2db-5272d587fd71",
    color: "#df920d",
    kår: "StuFF",
  },

  "cf9ee786-4cbd-41ff-8474-92ab8fad5549": {
    name: "MvSek",
    id: "cf9ee786-4cbd-41ff-8474-92ab8fad5549",
    color: "#75d0c9",
    kår: "StuFF",
  },
};

const otherGroup: Committee<string, "Övrigt"> = {
  "a16c78ef-6f00-492c-926e-bf1bfe9fce32": {
    name: "Övrigt",
    id: "a16c78ef-6f00-492c-926e-bf1bfe9fce32",
    color: "#808080",
    kår: "Övrigt",
  },
};

export const committees = {
  ...committeesConsensus,
  ...committeesLinTek,
  ...committeesStuff,
  ...otherGroup,
};

export const kårer = {
  Consensus: { ...committeesConsensus, ...otherGroup },
  LinTek: { ...committeesLinTek, ...otherGroup },
  StuFF: { ...committeesStuff, ...otherGroup },
  Övrigt: otherGroup,
};
