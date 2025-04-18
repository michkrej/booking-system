const bookableItems = [
  {
    label: { text: "Mat?" },
    editorType: "dxCheckBox",
    dataField: "food",
  },
  {
    label: { text: "Alkohol?" },
    editorType: "dxCheckBox",
    dataField: "alcohol",
  },
  {
    label: { text: "HG - bänkset" },
    editorType: "dxNumberBox",
    dataField: "bankset-hg",
    colSpan: 1,
  },
  {
    label: { text: "Kårallen - bänkset" },
    editorType: "dxNumberBox",
    dataField: "bankset-k",
    colSpan: 1,
  },
  {
    label: { text: "Kårallen - grillar" },
    editorType: "dxNumberBox",
    dataField: "grillar",
    colSpan: 1,
  },
  {
    label: { text: "Kårallen - bardiskar" },
    editorType: "dxNumberBox",
    dataField: "bardiskar",
    colSpan: 1,
  },
  {
    label: { text: "FF - Elverk" },
    editorType: "dxCheckBox",
    dataField: "elverk",
    colSpan: 1,
  },
  {
    label: { text: "FF - Släp" },
    editorType: "dxCheckBox",
    dataField: "trailer",
    colSpan: 1,
  },
  {
    label: { text: "FF - Tält" },
    editorType: "dxNumberBox",
    dataField: "tents",
    colSpan: 1,
  },
  {
    label: { text: "Scenpodier" },
    editorType: "dxNumberBox",
    dataField: "scene",
    colSpan: 1,
  },
  {
    label: { text: "Övriga inventarier för bokningen" },
    editorType: "dxTextArea",
    dataField: "annat",
    colSpan: 2,
  },
] as const;

export default bookableItems;
