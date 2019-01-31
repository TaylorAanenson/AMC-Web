import React from "react";
import "./MessageList.css";
import Timestamp from "react-timestamp";

const MessageList = props => {
  const { messagesList, chatSessionInfo, userInfo } = props;
  console.log("chat session info", chatSessionInfo);
  return (
    <div id="chat_messages_container">
      <div id="chat_messages-header">
        <div>
          {chatSessionInfo.length > 0 &&
            chatSessionInfo.map(chatSession => {
              return (
                <div>
                  <div className="deal-item-messages-list">
                    <div className="message-list-profile-header">
                      <div>
                        <i
                          className={
                            userInfo.length > 0 &&
                            chatSession.seller_id === userInfo[0].id
                              ? "fas py-3 px-4 user-icon-navbar " +
                                chatSession.buyer_photo
                              : "fas py-3 px-4 user-icon-navbar " +
                                chatSession.seller_photo
                          }
                        />
                      </div>
                      <div>
                        <strong>
                          {userInfo.length > 0 &&
                          chatSession.seller_id === userInfo[0].id
                            ? chatSession.buyer_name
                            : chatSession.seller_name}
                        </strong>
                      </div>
                    </div>

                    <div className="message-list-deal-header">
                      <div className="message-list-deal-name-price">
                        <div className="message-list-deal-name">
                          {chatSession.deal_name}
                        </div>
                        <div>
                          Pay in Dollar: ${chatSession.pay_in_dollar.toFixed(2)}
                        </div>
                        <div>
                          Pay in Crypto: ${chatSession.pay_in_crypto.toFixed(2)}
                        </div>
                      </div>
                      <div className="message-list-deal-image">
                        <img
                          src={chatSession.featured_deal_image}
                          alt="deal-image"
                        />
                      </div>
                      <div className="dropdown message-list-deal-dropdown">
                        <i
                          id="dropdownMenuButton"
                          data-toggle="dropdown"
                          aria-haspopup="true"
                          aria-expanded="false"
                          className="fas fa-lg fa-bars"
                        />
                        <div
                          className="dropdown-menu"
                          aria-labelledby="dropdownMenuButton"
                        >
                          <div className="dropdown-item">Delete</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
        </div>
        <hr />
      </div>
      <div id="chat-messages">
        {messagesList.map(msg => {
          return (
            <div
              className={
                msg.message_owner_id === msg.buyer_id
                  ? "chat-message buyer-message-left"
                  : "chat-message seller-message-right"
              }
            >
              <div>{msg.message}</div>
              <small>
                <Timestamp time={msg.date_message_sent} precision={1} />
              </small>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MessageList;
