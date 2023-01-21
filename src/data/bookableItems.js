const bookableItems = [
  {
    label: { text: 'Mat?' },
    editorType: 'dxCheckBox',
    dataField: 'food'
  },
  {
    label: { text: 'Alkohol?' },
    editorType: 'dxCheckBox',
    dataField: 'alcohol'
  },
  {
    label: { text: 'Kårallen - bänkset' },
    editorType: 'dxNumberBox',
    dataField: 'bankset-k',
    colSpan: 1
  },
  {
    label: { text: 'Kårallen - grillar' },
    editorType: 'dxNumberBox',
    dataField: 'grillar',
    colSpan: 1
  },
  {
    label: { text: 'Kårallen - bardiskar' },
    editorType: 'dxNumberBox',
    dataField: 'bardiskar',
    colSpan: 2
  },
  {
    label: { text: 'HG - bänkset' },
    editorType: 'dxNumberBox',
    dataField: 'bankset-hg',
    colSpan: 2
  },
  {
    label: { text: 'Övriga inventarier för bokningen' },
    editorType: 'dxTextArea',
    dataField: 'annat',
    colSpan: 2
  }
]

export default bookableItems
