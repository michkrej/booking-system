const THEME_COLORS = {
  primary: "#670c47",
  primary75: "#670c47b5",
  primary50: "#670c4778",
  primary25: "#670c473b",
  secondary: "#60a595",
  tertiary: "#818389",
};

const KAR_COLORS = {
  LinTek: { color: "#E1007A", bg: "#eff6ff", border: "#bfdbfe" },
  Consensus: { color: "#2cb2bf", bg: "#f5f3ff", border: "#ddd6fe" },
  StuFF: { color: "#007858", bg: "#fff7ed", border: "#fed7aa" },
  Övrigt: {
    color: THEME_COLORS.tertiary,
    bg: "hsl(283, 30%, 95%)",
    border: "hsl(321, 30%, 82%)",
  },
};

export { KAR_COLORS, THEME_COLORS };
