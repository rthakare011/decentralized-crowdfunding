export const sendApprovalEmail = async (email, title, id) => {
  console.log(`Sending approval email to ${email} for campaign ${title} (${id})`);
  // In a real app, this would call an API route to send the email
  return Promise.resolve();
};

export const sendRejectionEmail = async (email, title, reason) => {
  console.log(`Sending rejection email to ${email} for campaign ${title}. Reason: ${reason}`);
  // In a real app, this would call an API route to send the email
  return Promise.resolve();
};
