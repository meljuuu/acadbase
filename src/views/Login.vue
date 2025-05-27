<template>
  <div class="login-container">
    <div class="left-section">
      <span class="dot1"></span>
      <img
        src="../assets/login-image.png"
        alt="Login Illustration"
        class="illustration"
      />
    </div>
    <div class="right-section">
      <div class="login-box">
        <img
          src="../assets/school-logo.png"
          alt="School Logo"
          class="school-logo"
        />
        <h2>Sta. Rita Highschool</h2>
        <p>Record Keeping Management System</p>

        <form @submit.prevent="login">
          <div class="input-group">
            <input
              type="email"
              v-model="email"
              placeholder="Enter Domain Address"
              required
            />
            <label>Email Domain</label>
          </div>

          <div class="input-group">
            <div class="password-field">
              <input
                :type="showPassword ? 'text' : 'password'"
                v-model="password"
                placeholder="Enter Password"
                required
              />
              <label>Password</label>
              <span @click="togglePassword" class="toggle-password">
                <i
                  :class="showPassword ? 'fas fa-eye' : 'fas fa-eye-slash'"
                ></i>
              </span>
            </div>
          </div>

          <div class="options">
            <div class="remember-me">
              <input
                type="checkbox"
                v-model="rememberMe"
                id="remember"
                class="check-box"
              />
              <p>Remember me</p>
            </div>
            <a href="#" class="forgot-password">Forgot Password?</a>
          </div>

          <button type="submit" class="login-btn">Login</button>
          <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        </form>
        <p class="version">v1.0</p>
      </div>
    </div>
  </div>
</template>

<script>
import { useToast } from "vue-toastification";
import { loginTeacher } from "@/service/authService"; // Ensure path is correct

export default {
  name: "Login",
  data() {
    return {
      email: "",
      password: "",
      showPassword: false,
      rememberMe: false,
      errorMessage: "",
    };
  },
  methods: {
    togglePassword() {
      this.showPassword = !this.showPassword;
    },

    async login() {
      this.errorMessage = "";
      const toast = useToast(); // ✅ Move useToast inside method

      // Basic client-side validation
      if (!this.email.includes("@")) {
        this.errorMessage = "Invalid email format. Please enter a valid email.";
        return;
      }

      if (this.password.length < 6) {
        this.errorMessage = "Password must be at least 6 characters long.";
        return;
      }

      try {
        const { user, token, role } = await loginTeacher(this.email, this.password);

        // Optionally remember email
        if (this.rememberMe) {
          localStorage.setItem("rememberMe", true);
          localStorage.setItem("email", this.email);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("email");
        }

        // Store credentials
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("token", token);

        toast.success("Login successful! Welcome back.", {
          position: "top-center",
          timeout: 3000,
        });

        this.$router.push("/dashboard");
      } catch (error) {
        this.errorMessage = error || "Login failed. Please try again.";
        toast.error(error.message || "Login failed.");
      }
    },
  },
};
</script>


<style scoped>
/* Add these styles at the very top of your style section */
:root {
  overflow: hidden;
}

body, html {
  margin: 0;
  padding: 0;
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
}

body::-webkit-scrollbar,
html::-webkit-scrollbar {
  display: none;
}

.login-container {
  display: flex;
  width: 100vw;
  height: 100vh;
  background-color: #547fad;
  overflow: hidden;
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE and Edge */
  position: fixed; /* Add this */
  top: 0; /* Add this */
  left: 0; /* Add this */
}

/* Hide scrollbar for Chrome, Safari and Opera */
.login-container::-webkit-scrollbar {
  display: none;
}

.left-section .dot1 {
  position: absolute;
  height: 850px;
  width: 850px;
  background-color: #295f98;
  border-radius: 50%;
  z-index: 10;
  margin-left: -1000px;
  animation-name: animation1;
  animation-duration: 3s;
  animation-iteration-count: 1;
}

.left-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 50%;
}

.illustration {
  width: 75%;
  z-index: 10;
}

.right-section {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 20px;
  min-width: 50%;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-top-left-radius: 50px;
  border-bottom-left-radius: 50px;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.right-section::-webkit-scrollbar {
  display: none;
}

.login-box {
  text-align: center;
  width: 450px;
  padding: 30px;
  border: 5px;
}

.school-logo {
  width: 150px;
}

h2 {
  color: #295f98;
  font-weight: 500;
  margin: 0;
}

p {
  color: #295f98;
  font-weight: 500;
  margin: 0 0 30px 0;
}

label {
  display: block;
  text-align: left;
  margin-top: 10px;
  font-weight: bold;
  color: #333;
}

input {
  width: 100%;
  padding: 8px;
  margin-top: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.password-field {
  position: relative;
  width: 100%;
}

.input-group {
  position: relative;
  width: 100%;
  margin-bottom: 20px;
}

.input-group label {
  position: absolute;
  top: -15px;
  left: 10px;
  background-color: #fff;
  padding: 0 5px;
  font-size: 12px;
  color: #295f98;
}

.input-group input,
.password-field input {
  width: 100%;
  padding: 15px;
  border: 1px solid #295f98;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  background-color: #fff;
  box-sizing: border-box;
}

.input-group input::placeholder {
  font-size: 12px;
  color: #aaa;
}

.toggle-password {
  position: absolute;
  right: 15px;
  top: 55%;
  transform: translateY(-50%);
  cursor: pointer;
}
.options {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  margin-bottom: -30px;
  margin-top: -30px;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
}
.remember-me p {
  margin-top: 28px;
  font-weight: 400;
}

.check-box {
  margin: 0;
}

.forgot-password {
  color: #295f98;
  text-decoration: none;
  white-space: nowrap;
}
.login-btn {
  width: 100%;
  background-color: #295f98;
  color: #fff;
  padding: 15px;
  border: none;
  border-radius: 5px;
  margin-top: 20px;
  cursor: pointer;
  box-sizing: border-box;
}

.error-message {
  color: red;
  font-size: 14px;
  margin-top: 10px;
  text-align: center;
}

.version {
  margin-top: 10px;
  font-size: 12px;
  color: #999;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
}

/* Add these media queries at the end of the style section */
@media screen and (max-width: 1024px) {
  .login-container {
    flex-direction: column;
  }

  .left-section {
    min-width: 100%;
    height: 40vh;
  }

  .right-section {
    min-width: 100%;
    height: 60vh;
    border-radius: 50px 50px 0 0;
  }

  .illustration {
    width: 50%;
  }

  .login-box {
    width: 90%;
    max-width: 450px;
    padding: 20px;
  }
}

@media screen and (max-width: 768px) {
  .left-section {
    height: 30vh;
  }

  .right-section {
    height: 70vh;
  }

  .illustration {
    width: 40%;
  }

  .school-logo {
    width: 120px;
  }

  h2 {
    font-size: 1.5rem;
  }

  .options {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
    margin-bottom: 20px;
  }

  .remember-me {
    margin-bottom: 10px;
  }
}

@media screen and (max-width: 480px) {
  .left-section {
    height: 25vh;
  }

  .right-section {
    height: 75vh;
  }

  .illustration {
    width: 35%;
  }

  .login-box {
    padding: 15px;
  }

  .school-logo {
    width: 100px;
  }

  h2 {
    font-size: 1.3rem;
  }

  .input-group input,
  .password-field input {
    padding: 12px;
    font-size: 14px;
  }

  .login-btn {
    padding: 12px;
  }
}
</style>