import "./App.css";
import { useEffect } from "react";
import axios from "axios";
import { userLoginSuccess, userLogout } from "./actions/auth";
import { useDispatch, useSelector } from "react-redux";
function App() {
  const url = `https://zoom.us/oauth/authorize?response_type=code&client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_HOST_URL}`;
  const urlParams = new URLSearchParams(window.location.search);
  const apiUrl = process.env.REACT_APP_API_URL
  const code = urlParams.get("code");
  const user = useSelector((state) => state.auth.currentUser);
  const dispatch = useDispatch();
  useEffect(() => {
    if (code && !user) {
      axios
        .get(`${apiUrl}/token/${code}`)
        .then((res) => {
          const { access_token } = res.data;
          localStorage.setItem("accessToken", JSON.stringify(access_token));
          axios
            .post(`${apiUrl}/profile`, {
              accessToken: access_token,
            })
            .then((res) => {
              const data = res.data;
              console.log("User", data);
              localStorage.setItem("user", JSON.stringify(data));
              const action = userLoginSuccess(data);
              dispatch(action);
            });
        })
        .catch((error) => console.log(error));
    }
  }, [code]);
  function handleChange(event) {
    console.log(event.target.files[0]);
    let image = document.getElementById("image")
    image.src = URL.createObjectURL(event.target.files[0]);
    
  }
  function handleClick() {
    const logoutAction = userLogout();
    localStorage.setItem("user", null);
    localStorage.setItem("token", null);
    dispatch(logoutAction);
  }
  return (
    <div className="form-body">
      <div className="row">
        <div className="form-holder">
          <div className="form-content">
            <div className="form-items">
              {!user && (
                <div className="form-button">
                  <a href={url} type="submit" className="ibtn" id="loginBtn">
                    Login with Zoom
                  </a>
                </div>
              )}
              {user && (
                <div className="form-button">
                  <button
                    type="submit"
                    className="ibtn"
                    id="loginBtn"
                    onClick={handleClick}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {user && (
        <div>
          <section className="section about-section gray-bg" id="about">
            <div className="container">
              <div className="row align-items-center flex-row-reverse">
                <div className="col-lg-6">
                  <div className="about-text go-to">
                    <h3 className="dark-color">Profile</h3>
                    <div className="row about-list">
                      <div className="col-md-6">
                        <div className="media">
                          <label>Account Id</label>
                          <p>{user.account_id}</p>
                        </div>
                        <div className="media">
                          <label>Account Number</label>
                          <p>{user.account_number}</p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="media">
                          <label>First Name</label>
                          <p>{user.first_name}</p>
                        </div>
                        <div className="media">
                          <label>Last Name</label>
                          <p>{user.last_name}</p>
                        </div>
                        <div className="media">
                          <label>E-mail</label>
                          <p>{user.email}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-lg-6">
                  <div className="about-avatar">
                    <img
                      height="300"
                      width="300"
                      src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/65/No-Image-Placeholder.svg/1665px-No-Image-Placeholder.svg.png"
                      alt="avatar"
                      id="image"
                    />

                    <div className="input-group mb-3  rounded-pill">
                      <input
                        id="upload"
                        type="file"
                        onChange={handleChange}
                        className="form-control border-0"
                        accept="image/*"
                      />
                      <label
                        id="upload-label"
                        htmlFor="upload"
                        className="font-weight-light text-muted"
                      >
                        Choose file
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default App;
