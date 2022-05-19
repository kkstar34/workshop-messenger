import React, { useRef } from "react";
import "./Message.css";
import { useState, useEffect } from "react";
import { onSnapshot, collection, addDoc, orderBy } from "firebase/firestore";
import { query } from "firebase/firestore";
import db from "../config/firebaseConfig";
import { getDocs } from "firebase/firestore";
import { where } from "firebase/firestore";
import { useUserAuth } from "./../context/UserAuthContextProvider";
import { useNavigate } from 'react-router-dom';

function Message() {
  const { user, logOut } = useUserAuth();
  const [content, setContent] = useState("");
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();
  const scroll = useRef();

  useEffect(() => {
    const q = query(collection(db, "messages"), orderBy("created_at"));
    const unsub = onSnapshot(q, async (querySnapshot) => {
      let querySnapshotArray = querySnapshot.docs;
      let messageTab = [];
      for (let i = 0; i < querySnapshotArray.length; i++) {
        messageTab.push(querySnapshotArray[i].data());
      }
      setMessages(messageTab);
      scroll.current.scrollIntoView({ behavior: 'smooth' })
      playSound();
    });

    return () => {
      unsub();
    };
  }, []);

  const onEnterPress = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
        e.preventDefault();
        handleSubmit();
      }
  }

  const handleSubmit = async (e) => {
    if (content === "") {
      return false;
    }

    

    let message = {
      content: content,
      user_uid: user.uid,
      created_at: new Date(),
      updated_at: new Date(),
    };

    addDoc(collection(db, "messages"), message)
      .then((doc) => {
        document.getElementById("messageForm").reset();
        scroll.current.scrollIntoView({ behavior: 'smooth' })
      })
      .catch((err) => {
        console.error("erreur lors de l'ajout du message ", err);
      });
  };


  const playSound = () => {
      const url = 'audios/ring.mp3';
    const audio = new Audio(url);
    audio.play();
  }
  


 
  const handleLogout = async(e) =>
  {
    e.preventDefault();

    try {
      await logOut();
      navigate('/');
    }catch(e) {


    }
 }
   

  return (
    <div className="messenger">
        <div className="messenger-header">
            <div>
                <span className="mr-2">{user.email}</span>
                <a onClick={handleLogout} href="#empty" style={{textDecoration: 'none'}}><i className="fa fa-power-off"></i> Deconnexion</a>
            </div>
        </div>
 
      <div className="messenger--body">
        <div className="messenger--body__title">
          <div className="profil">
            <div className="pr">
              <img src="img/1.jpeg" alt="profil " />
              <div className="green--dot"></div>
            </div>

            <div>
              <h2>Cp gbairai 👀</h2>
              <p>En ligne</p>
            </div>
          </div>

          <div className="options">
            <ul>
              <li>
                <a href="#empty">
                  <i className="fas fa-phone-alt"></i>
                </a>
              </li>

              <li>
                <a href="#empty">
                  <i className="fas fa-video"></i>
                </a>
              </li>

              <li>
                <a href="#empty">
                  <i className="fas fa-minus"></i>
                </a>
              </li>

              <li>
                <a href="#empty">
                  <i className="fas fa-times"></i>
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="messenger--body__body">
          <div className="firstMess">
            <img src="img/1.jpeg" alt="profil" />
            <h2>Cp gbairai 👀</h2>
            <p>Facebook</p>
            <p>Vous êtes amis sur Facebook</p>
          </div>

          <p className="date">31/07/2020 13:58</p>
          {messages &&
            messages.map((message, i) => {
              return (
                <div
                  key={i}
                  className={
                    user.uid === message.user_uid
                      ? "blue--bubbles"
                      : "grey--bubbles"
                  }
                >
                  {user.uid !== message.user_uid ? (
                    <img src="img/1.jpeg" alt="profil " />
                  ) : null}
                  <div
                    className={user.uid === message.user_uid ? "blue" : "grey"}
                  >
                    <p>{message.content}</p>
                  </div>
                  {user.uid === message.user_uid ? (
                    <img src="img/2.png" alt="profil " />
                  ) : null}
                </div>
              );
            })}
            <div ref={scroll}></div>
        </div>

        <div className="messenger--body__bottom">
          <form onSubmit={handleSubmit} id="messageForm">
            <ul>
              <li>
                <a href="#empty">
                  <i className="fas fa-plus-circle"></i>
                </a>
              </li>

              <li>
                <a href="#empty">
                  <i className="fas fa-img"></i>
                </a>
              </li>

              <li>
                <a href="#empty">
                  <i className="fas fa-sticky-note"></i>
                </a>
              </li>

              <li>
                <a href="#empty" >
                  <i className="fas fa-gift"></i>

                </a>
              </li>

              <li>
                <div className="type">
                  <textarea
                    
                    placeholder="Aa"
                    onChange={(e) => setContent(e.target.value)}
                    onKeyDown={onEnterPress}
                    type="submit"
                  ></textarea>
                  <i className="fas fa-smile"></i>
                </div>
              </li>

              <li>
                <a
                  href="#empty"
                  onClick={(e) => {
                    e.preventDefault();
                    handleSubmit();
                  }}
                >
                  <i className="fas fa-thumbs-up"></i>
                </a>
              </li>
            </ul>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Message;
