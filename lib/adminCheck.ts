export const isAdmin = (userId?: string | null) => {
    if (!userId) return false; // Return false if userId is undefined or null
    return userId === process.env.NEXT_PUBLIC_ADMIN_ONE || userId === process.env.NEXT_PUBLIC_ADMIN_TWO;
  };