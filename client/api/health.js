module.exports = (req, res) => {
  res.status(200).json({
    ok: true,
    node: process.version,
    hasSUPABASE_URL: !!process.env.SUPABASE_URL,
    hasSERVICE_ROLE: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    hasADMIN_SECRET: !!process.env.ADMIN_SECRET
  });
};
