import apiRequest from "./apirequest.js";

/* A small data model to represent a Post. */
export class Post {
  /* data is the post data from the API. */
  constructor(data) {
    /* Technically we don't have a full User object here (no followers list), but this is still useful. */
    this.user = new User(data.user);
    this.time = new Date(data.time);
    this.text = data.text;
  }
}

/* A data model representing a user of the app. */
export default class User {
  /* Returns an array of user IDs. */
  static async listUsers() {
    try {
      let data = await apiRequest("GET", "/users");
      console.log(data); // Thêm dòng này để kiểm tra dữ liệu trả về từ API
      return data.users;
    } catch (error) {
      console.error("Error fetching user list:", error);
      throw error; // Ném lỗi để xử lý ở nơi gọi hàm nếu cần
    }
  }
  
  
  

  /* Returns a User instance, creating the user if necessary. */
  static async loadOrCreate(id) {
    try {
      // Thử lấy thông tin người dùng từ backend
      let userData = await apiRequest("GET", `/users/${id}`);
      // Nếu người dùng tồn tại, trả về một thể hiện User mới
      return new User(userData);
    } catch (error) {
      // Nếu không tìm thấy người dùng, tạo một người dùng mới
      if (error.statusCode === 404) {
        let newUser = await apiRequest("POST", "/users", { id });
        return new User(newUser);
      } else {
        throw error; // Ném lỗi ra ngoài nếu có lỗi xảy ra khác
      }
    }
  }

  /* data is the user object from the API. */
  constructor(data) {
    // Khởi tạo các thuộc tính của người dùng từ dữ liệu được trả về từ backend
    this.id = data.id;
    this.name = data.name;
    this.avatarURL = data.avatarURL;
    this.following = data.following || [];
  }

  /* The string representation of a User is their display name. */
  toString() {
    return this.name;
  }

  /* Returns an Object containing only the instances variables we want to send back to the API when we save() the user. */
  toJSON() {
    return {
      id: this.id,
      name: this.name,
      avatarURL: this.avatarURL
    };
  }

  /* Save the current state (name and avatar URL) of the user to the server. */
  async save() {
    // Gửi yêu cầu PATCH để cập nhật thông tin người dùng lên server
    await apiRequest("PATCH", `/users/${this.id}`, this.toJSON());
  }

  /* Gets the user's current feed. Returns an Array of Post objects. */
  async getFeed() {
    let feedData = await apiRequest("GET", `/users/${this.id}/feed`);
    return feedData.posts.map(postData => new Post(postData));
  }

  /* Create a new post with the given text. */
  async makePost(text) {
    await apiRequest("POST", "/posts", { user: this.id, text });
  }

  /* Start following the specified user id. Does not handle any HTTPErrors generated by the API. */
  async addFollow(id) {
    await apiRequest("POST", `/users/${this.id}/following`, { user: id });
  }

  /* Stop following the specified user id. Does not handle any HTTPErrors generated by the API. */
  async deleteFollow(id) {
    await apiRequest("DELETE", `/users/${this.id}/following/${id}`);
  }
}
