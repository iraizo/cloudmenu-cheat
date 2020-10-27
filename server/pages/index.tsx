import React from "react";
import { AiOutlineEye, AiOutlineAim, AiOutlineFormatPainter, AiOutlineSetting } from "react-icons/ai";
import Swal from 'sweetalert2'
import withReactContent from 'sweetalert2-react-content'
import { NotificationContainer, NotificationManager } from 'react-notifications';
import { isThisTypeNode } from "typescript";

const loginF = withReactContent(Swal)
/* this is very poor naming, i use this to call the error too */
const success = withReactContent(Swal)


interface iState {
    tab: number,
    /* define all your values in here that you want to send to the server */
    values: {
        aim: boolean
    }
}

export default class Index extends React.Component<any, any> {


    state: iState = { tab: 0, values: { aim: false } }

    drawTab() {
        let index = this.state.tab;
        switch (index) {
            case 0: /* aim */
                return <div>
                    <p>Aim</p>
                    <input type={"checkbox"} value={0} onChange={(e) => this.setState({ values: { aim: !this.state.values.aim } })} />
                </div>
                    ;
                break;
            case 1: /* visuals */
                return <p>Visuals</p>;
                break;
            case 2: /* colors */
                return <p>Colors</p>;
                break;
            case 3: /* settings */
                return <p>Settings</p>;
                break;
            default:
                console.log("Index out of range, cant seem to draw menu");
                break;

        }
    }

    login() {
        loginF.fire({
            title: <p>Login</p>,
            input: "password",
            inputLabel: "Authorization",
            inputPlaceholder: "Enter your token",

        }).then(result => {
            let password = result.value;

            if (!password) return;

            fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "authorization": password
                },
            }).then(async response => {
                let json = await response.json()
                if (json["success"]) {
                    success.fire({
                        icon: "success",
                        title: "Sucess",
                        text: "Sucessfully logged in!"
                    }
                    )
                } else {
                    success.fire({
                        icon: "error",
                        title: "Error",
                        text: json["error"]
                    }
                    )
                }
            })
        })
    }

    register() {
        loginF.fire({
            title: <p>Login</p>,
            input: "text",
            inputLabel: "Register",
            inputPlaceholder: "Enter your username",

        }).then(result => {
            let username = result.value;

            if (!username) return;

            fetch("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ username: username })
            }).then(async response => {
                let json = await response.json();
                if (json["success"]) {
                    success.fire({
                        icon: "success",
                        title: "Sucess",
                        text: "token: " + json["token"]
                    })
                } else {
                    success.fire({
                        icon: "error",
                        title: "Error",
                        text: json["error"]
                    }
                    )
                }
            })
        })
    }

    save = () => {
        fetch("api/auth/currentUser", {
            method: "GET"
        }).then(async response => {
            let json = await response.json();
            if (json["auth"]) {
                let values = this.state.values;
                fetch("api/menu/sendInfo", {
                    method: "POST",
                    headers: {
                        "authorization": json["auth"],
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({ data: values })
                }).then(async Fresponse => {
                    let fJson = await Fresponse.json();
                    if (fJson["success"]) {
                        NotificationManager.success(fJson["message"], "Success")
                    } else {
                        NotificationManager.error(fJson["error"], "Error")
                    }
                })
            } else {
                NotificationManager.error("Not logged in.", "Error");
            }
        })
    }

    render() {
        return (
            <body className={"bg-teal-600 overflow-x-hidden overflow-y-hidden"}>
                <div id={"navbar"} className={"flex flex-row m-2"}>
                    <button onClick={this.login} className={"mx-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
                        Login
                    </button>
                    <button onClick={this.register} className={"bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"}>
                        Register
                    </button>

                </div>
                <div id={"wrapper"} className={"h-screen w-screen"}>
                    <div id={"menu"} className={"flex flex-row m-64 pb-16 p-12 w-1/5 rounded-lg bg-gray-200 shadow-2xl"}>
                        <div id={"controls"} className={"flex flex-col"}>
                            <a onClick={() => this.setState({ tab: 0 })}><AiOutlineAim className={"my-4 h-8 w-8 hover:text-indigo-700 duration-500"} /></a>
                            <a onClick={() => this.setState({ tab: 1 })}><AiOutlineEye className={"my-4 h-8 w-8 hover:text-indigo-700 duration-500"} /></a>
                            <a onClick={() => this.setState({ tab: 2 })}><AiOutlineFormatPainter className={"my-4 h-8 w-8 hover:text-indigo-700 duration-500"} /></a>
                            <a onClick={() => this.setState({ tab: 3 })}><AiOutlineSetting className={"my-4 h-8 w-8 hover:text-indigo-700 duration-500"} /></a>
                            <button onClick={this.save} className={"bg-blue-500 hover:bg-blue-700 text-white font-bold mt-4 py-2 px-4 rounded-full"}>
                                Save
                            </button>
                        </div>
                        <div id={"toggles"} className={"flex flex-row ml-8"}>
                            {this.drawTab()}
                        </div>
                    </div>
                    <NotificationContainer />
                </div>
            </body >
        )
    }
}
