export const getCurrentDate = () => {
    const today = new Date();
    return today.toLocaleDateString("en-US", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });
};

export const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
};

export const formatApprovalDate = (isoDateString: string) => {
  const date = new Date(isoDateString);
  
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',   
    day: 'numeric',   
    year: 'numeric',  
    hour: '2-digit',   
    minute: '2-digit',
    hour12: true    
  }).format(date);
  
};

