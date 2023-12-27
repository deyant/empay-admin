import defaultUser from '../utils/default-user';

export async function signIn(username, password) {
  try {
    let loginData = new FormData();
    loginData.append('username', username);
    loginData.append('password', password);
    try {
      const response = await fetch("/login", {
          method: 'POST',
          headers: {'Accept': 'application/json'},
          body: loginData
      });

      if (!response.ok) {
        return {
          isOk: false
        };
      } else {
        let userData = await response.json();
        userData.email = userData.username;
        userData.avatarUrl =  'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png';
        console.log(userData);
        return {
          isOk: true,
          data: userData
        };
      }
    } catch (error) {
      alert.error("There has been a problem with your fetch operation:", error);
    }
  }
  catch {
    return {
      isOk: false,
      message: "Authentication failed"
    };
  }
}

export async function getUser() {
  try {
    try {
      const response = await fetch("/api/v1/security/current", {
        headers: {'Accept': 'application/json'},
      });
      if (!response.ok) {
        throw new Error("Network response was not OK");
      }
      const userData = await response.json();
      userData.email = userData.username;
      userData.avatarUrl =  'https://js.devexpress.com/Demos/WidgetsGallery/JSDemos/images/employees/06.png';
      return {
        isOk: true,
        data: userData
      };
    } catch (error) {
      alert.error("There has been a problem with your fetch operation:", error);
    }

    // return {
    //   isOk: true,
    //   data: defaultUser
    // };
  }
  catch {
    return {
      isOk: false
    };
  }
}

export async function createAccount(email, password) {
  try {
    // Send request
    console.log(email, password);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to create account"
    };
  }
}

export async function changePassword(email, recoveryCode) {
  try {
    // Send request
    console.log(email, recoveryCode);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to change password"
    }
  }
}

export async function resetPassword(email) {
  try {
    // Send request
    console.log(email);

    return {
      isOk: true
    };
  }
  catch {
    return {
      isOk: false,
      message: "Failed to reset password"
    };
  }
}
