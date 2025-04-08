
const SECRET_KEY = "blogMaster"; 
interface UserData {
  userName: string;
  email: string;
  password: string;
}

// Register function
export const register = async (userName: string, email: string, password: string) => {
  const existingUsers = JSON.parse(localStorage.getItem("users") || "[]") as UserData[];
  const isUserExists = existingUsers.some(user => user.email === email);

  if (isUserExists) {
    throw new Error("User already exists");
  }

  const newUser = { userName, email, password };
  existingUsers.push(newUser);
  localStorage.setItem("users", JSON.stringify(existingUsers));

  return { message: "User registered successfully",success: true };
};


// Login function
export const login = async (email: string, password: string) => {
  const users = JSON.parse(localStorage.getItem("users") || "[]") as UserData[];
  const matchedUser = users.find(user => user.email === email && user.password === password);

  if (!matchedUser) {
    throw new Error("Invalid email or password");
  }
  return { message: "Login successful", success: true, user: matchedUser };
};

