const roles = ["Admin", "Manager", "Pharmacist", "Billing", "StoreKeeper"];

exports.getRoles = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: roles,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch roles",
    });
  }
};
