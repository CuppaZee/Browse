import { BrowseModuleClass } from "../module";
import React from "react";
import ReactDOM from "react-dom";

function friendlyErrorMessage(errorMessage: string) {
  if (errorMessage === "please enter your username") {
    return "Please enter your username";
  }
  if (errorMessage === "please enter your password") {
    return "Please enter your password";
  }
  if (errorMessage === "either username or password are not valid") {
    return "Invalid username or password";
  }
  return errorMessage;
}

function LoginPage({
  username,
  applicationName,
  errorMessage,
}: {
  username: string | null;
  errorMessage: string | null;
  applicationName: string;
  }) {
  if (!username) {
    return (
      <div
        style={{ minHeight: "100vh" }}
        className="d-flex flex-column justify-content-center align-items-center">
        <div className="card p-4 d-flex flex-column">
          <img
            src="https://munzee.global.ssl.fastly.net/images/munzee-logo.svg"
            style={{ maxHeight: 100, maxWidth: "90%" }}
            className="align-self-center pb-2"
          />
          {errorMessage && (
            <div className="alert alert-danger" role="alert">
              {friendlyErrorMessage(errorMessage)}
            </div>
          )}
          <form className="d-flex flex-column" method="POST">
            <legend>Sign in</legend>
            <div className="mb-3">
              <label htmlFor="usernameInput" className="form-label">
                Username
              </label>
              <input type="text" className="form-control" id="usernameInput" name="username" />
            </div>
            <div className="mb-3">
              <label htmlFor="passwordInput" className="form-label">
                Password
              </label>
              <input type="password" className="form-control" id="passwordInput" name="password" />
            </div>
            <input className="align-self-end btn btn-success" type="submit" value="Login" />
          </form>
        </div>
      </div>
    );
  }
  return (
    <div
      style={{ minHeight: "100vh" }}
      className="d-flex flex-column justify-content-center align-items-center">
      <div className="card m-2 px-4 py-2 d-flex flex-column" style={{ maxWidth: 400 }}>
        <img
          src={`https://server.cuppazee.app/user/avatar?username=${encodeURIComponent(username)}`}
          style={{ width: 64, height: 64, borderRadius: 32 }}
          className="align-self-center m-2"
        />
        {errorMessage && (
          <div className="alert alert-danger" role="alert">
            {friendlyErrorMessage(errorMessage)}
          </div>
        )}
        <h4 className="text-center">{applicationName}</h4>
        <h6 className="text-center">wants to access your Munzee Account</h6>
        <small className="text-center">
          You are currently logged in as {username}.<br />
          <a href="/oauth/signout">Switch Account</a>
        </small>
        <form className="d-flex flex-column" method="POST">
          <ul className="list-group mt-2 mb-4">
            <li className="list-group-item d-flex flex-column">
              <small className="fw-bold">This will allow {applicationName} to:</small>
            </li>
            {/* TODO: Handle other scopes? */}
            <li className="list-group-item d-flex flex-column">
              <div className="fw-bold">Read Data</div>
              <small>Access data linked with your Munzee Account</small>
            </li>
          </ul>
          <div className="d-flex flex-row-reverse">
            <input
              className="btn btn-success"
              type="submit"
              name="AllowAccessButton"
              value="Allow Access"
            />
            <div className="flex-grow-1" />
            <input
              className="align-self-stretch btn btn-outline-secondary"
              type="submit"
              name="declineAccessButton"
              value="Cancel"
            />
          </div>
          <small className="pt-4 fst-italic">
            You can revoke {applicationName}'s access to your account at any time at{" "}
            <a href="https://www.munzee.com/revoke">https://www.munzee.com/revoke</a>
          </small>
        </form>
      </div>
    </div>
  );
}

export class APILoginModule extends BrowseModuleClass {
  name = "Refined API Login";
  id = "apilogin";
  urls = ["*api.munzee.com/oauth/*"];

  async injectStyles() {
    document.head.innerHTML += `
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-F3w7mX95PdgyTmZZMECAngseQB83DfGTowi0iMjiWaeVhAn4FJkqJByhZMI3AhiU" crossorigin="anonymous">
    <style>
      body {
        background: #00C35B url("https://server.cuppazee.app/LoginBackground.png");
      }
      /** {
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
      }
      h3, h2, p {
        text-align: center;
      }
      body {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      img {
        max-height: 60px;
        max-width: 90%;
        width: auto !important;
      }
      li {
        display: flex;
        flex-direction: column;
        align-items: center;
      }*/
      /*form > p {
        font-size: 1.3rem;
      }/*
    </style>
  `;
  }

  async execute() {
    const query = document.querySelectorAll("p:nth-child(2) strong");
    const username = query.length === 1 ? null : query[0].innerHTML;
    const applicationName = (query[1] ?? query[0]).innerHTML;
    console.log(username, applicationName);

    // document.querySelectorAll<HTMLInputElement>("form input").forEach(i => {
    //   if (i.type === "submit") {
    //     i.classList.add("btn");
    //     if (i.value.includes("Do Not")) {
    //       i.classList.add("btn-dark");
    //     } else {
    //       i.classList.add("btn-success");
    //     }
    //   } else {
    //     i.classList.add("form-control");
    //   }
    // });

    // document.querySelectorAll<HTMLElement>("p strong").forEach(i => {
    //   if (i.innerText === "Please sign in:") {
    //     i.outerHTML = `<h4>Sign In</h4>`;
    //   }
    // });

    // document.querySelectorAll<HTMLElement>("li i").forEach(i => {
    //   if (i.innerText.includes("read all data")) {
    //     i.innerText = `Read data that you can access with your Munzee account`;
    //   }
    // });

    const errorMessage =
      Array.from(document.querySelectorAll<HTMLElement>("p")).find(
        i => i.style.color === "rgb(255, 0, 0)"
      )?.innerText ?? null;

    // document.querySelectorAll<HTMLElement>("p").forEach(i => {
    //   if (i.style.color === "rgb(255, 0, 0)") {
    //     i.classList.add("alert", "alert-danger");
    //     i.style.color = ""
    //   }
    //   if (i.innerText.includes("please enter your username")) {
    //     i.innerText = "Please enter your username";
    //   }
    //   if (i.innerText.includes("please enter your password")) {
    //     i.innerText = "Please enter your password";
    //   }
    //   if (i.innerText.includes("either username or password are not valid")) {
    //     i.innerText = "Invalid username or password";
    //   }
    //   if (i.innerText.includes("would like to access") && window.location.href.includes("/signin")) {
    //     i.style.display = "none";
    //   }
    //   if (i.innerText.includes("will be able to:")) {
    //     i.outerHTML = "";
    //     // i.innerHTML = `By pressing Allow Access, you will allow <b>${applicationName}</b> to:`;
    //   }
    //   if (i.innerText.includes("You are not ")) {
    //     i.outerHTML = `<a class="btn btn-sm btn-outline-secondary" href="/oauth/signout">Switch Account</a>` + (username ? `<p class="pt-2"><i><small>You can revoke ${applicationName}'s access to your Munzee Account at any time by visiting <a href="https://www.munzee.com/revoke">https://www.munzee.com/revoke</a>.</small></i></p>` : "");
    //   }
    //   if (i.innerText.includes("would like to access your munzee.com")) {
    //     if (username) {
    //     i.outerHTML = `
    //     <h3 class="m-0">${applicationName}</h3>
    //     <h5 class="m-0">wants to access your Munzee account</h5>
    //     <p class="m-0">You are signed it as <b>${username}</b>. <small><a href="/oauth/signout">Switch Account</a></small></p>
    //     <p>
    //       Howdy <b>${username}</b>, <b>${applicationName}</b> would like to access your Munzee Account.<br/>By pressing Allow Access, you will allow <b>${applicationName}</b> to:
    //     </p>`;
    //     } else {
    //       i.outerHTML = "";
    //     }
    //   }
    // });

    //  TODO: Page-specific rendering
    const appDiv = document.createElement("div");
    appDiv.id = "app";
    document.body.innerHTML = "";
    document.body.appendChild(appDiv);
    ReactDOM.render(
      <LoginPage
        username={username}
        applicationName={applicationName}
        errorMessage={errorMessage}
      />,
      appDiv
    );

    this.injectStyles();
  }
}
