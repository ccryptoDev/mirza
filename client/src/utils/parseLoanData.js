export const getLoanData = ({
  screenTrackings,
  paymentManagements,
  id: screenId,
}) => {
  const pms = Array.isArray(paymentManagements) ? [...paymentManagements] : [];
  const sts = Array.isArray(screenTrackings) ? [...screenTrackings] : [];

  // IF APPLICTION ID IS PRESENT ON URL
  if (screenId) {
    const screenTracking = sts.find((st) => st.id === screenId);
    const paymentManagement = pms.find(
      (pm) => pm.screenTrackingId === screenId
    );
    return { screenTracking, paymentManagement };
  }

  // IF APPLICATION ID IS NOT PRESENT ON URL - TAKE THE LAST ITEMS
  if (pms.length && sts.length) {
    return {
      screenTracking: sts[sts.length - 1],
      paymentManagement: pms[pms.length - 1],
    };
  }
  return null;
};
