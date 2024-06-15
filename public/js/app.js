import FollowList from "./followlist.js";
import User, { Post } from "./user.js";

export default class App {
  constructor() {
    /* Store the currently logged-in user. */
    this._user = null;

    this._onListUsers = this._onListUsers.bind(this);
    this._onLogin = this._onLogin.bind(this);

    this._loginForm = document.querySelector("#loginForm");
    if (this._loginForm) {
      this._loginForm.listUsers.addEventListener("click", this._onListUsers);
      this._loginForm.login.addEventListener("click", this._onLogin); // Xử lý sự kiện click của nút "Login"
    }

    // Khởi tạo FollowList
    this._followList = new FollowList(
      document.querySelector("#followContainer"),
      this._onFollowUser,
      this._onUnfollowUser

      
    );
  }

  /*** Event handlers ***/

    
    

    
  async _onListUsers() {
    let users = await User.listUsers();
    let usersStr = users.join("\n");
    alert(`List of users:\n\n${usersStr}`);
  }

  async _onLogin(event) {
    event.preventDefault();
    const userId = this._loginForm.userid.value;
    if (userId) {
      try {
        // Tải hồ sơ của người dùng
        this._user = await User.loadOrCreate(userId);
        await this._loadProfile(); // Cập nhật thông tin hồ sơ và hiển thị feed của người dùng
      } catch (error) {
        console.error("Error logging in:", error);
      }
    } else {
      console.error("User ID is required");
    }
  }
  
  
  
  
  

  //TODO: Add your event handlers/callback functions here

  /*** Helper methods ***/

  /* Add the given Post object to the feed. */
  _displayPost(post) {
    /* Make sure we receive a Post object. */
    if (!(post instanceof Post)) throw new Error("displayPost wasn't passed a Post object");

    let elem = document.querySelector("#templatePost").cloneNode(true);
    elem.id = "";

    let avatar = elem.querySelector(".avatar");
    avatar.src = post.user.avatarURL;
    avatar.alt = `${post.user}'s avatar`;

    elem.querySelector(".name").textContent = post.user;
    elem.querySelector(".userid").textContent = post.user.id;
    elem.querySelector(".time").textContent = post.time.toLocaleString();
    elem.querySelector(".text").textContent = post.text;

    document.querySelector("#feed").append(elem);
  }

  /* Load (or reload) a user's profile. Assumes that this._user has been set to a User instance. */
 
  async _loadProfile() {
    document.querySelector("#welcome").classList.add("hidden");
    document.querySelector("#main").classList.remove("hidden");
    document.querySelector("#idContainer").textContent = this._user.id;
    /* Reset the feed. */
    document.querySelector("#feed").textContent = "";

    // Kiểm tra và gán giá trị cho _postForm
    if (!this._postForm) {
        this._postForm = document.querySelector("#postForm");
    }

    /* Update the avatar, name, and user ID in the new post form */
    if (this._postForm) {
        this._postForm.querySelector(".avatar").src = this._user.avatarURL;
        this._postForm.querySelector(".name").textContent = this._user;
        this._postForm.querySelector(".userid").textContent = this._user.id;
    } else {
        console.error("_postForm is not defined");
    }

    //TODO: Update the rest of the sidebar and show the user's feed
}

 
 
 
 

 
 
 
 

 
 
}
