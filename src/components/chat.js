import React, {Component} from 'react';
import {Route, NavLink} from 'react-router-dom';
// var twilioChat = require("twilio-chat");
// var twilioFrame = require("twilio-frame");

// import * as Twilio from 'twilio-common';
// import * as Chat from 'twilio-chat';
// import * as Frame from 'twilio-frame';

class ChatFrame extends Component {


    constructor(props){
        super(props);

        this.state = {
            channel: props.channel,
            token: props.token,
            username: props.username
        };

        // this.loadTwiliochat = this.loadTwiliochat.bind(this);
        this.loadTwiliochat();
    }

    loadTwiliochat() {

        // Our interface to the Chat service
        let chatClient;

        // A handle to the state chat channel
        let generalChannel = this.state.channel;

        // The server will assign the client a username
        let username;

        fetch('/token')
            .then((response) => response.json())
            .then((data) => {

                // Initialize the Chat client
                chatClient = new Twilio.Chat.Client(data.token);
                chatClient.getSubscribedChannels().then(createOrJoinGeneralChannel);

            });

        function createOrJoinGeneralChannel() {
            // Get the general chat channel, which is where all the messages are
            // sent in this simple application
            console.log('Attempting to join ',  generalChannel );
            var promise = chatClient.getChannelByUniqueName(generalChannel);
            promise.then(function(channel) {
                generalChannel = channel;
                console.log('Found ' + generalChannel + ' channel:');
                console.log(generalChannel);
                setupChannel();
            }).catch(function() {
                // If it doesn't exist, let's create it
                console.log('Creating general channel');
                chatClient.createChannel({
                    uniqueName: generalChannel,
                    friendlyName: 'General Chat Channel'
                }).then(function(channel) {
                    console.log('Created general channel:');
                    console.log(channel);
                    generalChannel = channel;
                    setupChannel();
                });
            });
        }

        // Set up channel after it has been found
        function setupChannel() {
            // Join the general channel
            generalChannel.join().then(function(channel) {
                console.log('Joined channel as ' + username, false);

                loadFrame(chatClient, generalChannel);

            });

            // Listen for new messages sent to the channel
            generalChannel.on('messageAdded', function(message) {
                console.log('new messages sent', message.author, message.body);
            });
        }

        function loadFrame(client, channel) {

            console.log('loading frame configuration');
            let frameConfiguration = {
                channel: {
                    chrome: {
                        closeCallback: channelSid => {
                            alert('close');
                            chatFrame.unloadChannelBySid(channelSid);

                        }
                    },
                    header: {
                        visible: true,
                        image: {
                            visible: false
                        },
                        title: {
                            visible: true,
                            default: 'Chat Frame'
                        }
                    },
                    visual: {
                        colorTheme: 'LightTheme',
                        MessageStyle: 'Minimal',
                        messageStyle: 'Squared',
                        inputAreaStyle: 'Bubble',
                        override: {
                            incomingMessage: {
                                body: {
                                    background: '#00bff5',
                                    color: '#ffffff'
                                },
                                avatar: {
                                    background: '#00bff5',
                                    color: '#ffffff'
                                }
                            }
                        }
                    }
                }
            };
            const chatFrame = Twilio.Frame.createChat(client, frameConfiguration);
            chatFrame.loadChannel('#chatContainer', channel);
        }


    }

    render() {
        return (
            <div id="chatContainer" className="twilio-react-chat">

            </div>
        )
    }

};

export default ChatFrame;
