import React, {Component} from 'react';

class ChatInit extends Component {


    constructor(props){
        super(props);

        this.state = {
            // Get an access token from Twilio for the current user
            token: props.token
        };

        if(props.token){

            // Initialize the Chat client
            chatClient = new Twilio.Chat.Client(props.token);
            chatClient.getSubscribedChannels().then(createOrJoinGeneralChannel);

        } else {
            console.log('no token yet');
            return <h1>loading....</h1>
        }

    }


    render() {
        return (
            <div id="chatContainer" className="twilio-react-chat">

            </div>
        )
    }

}

export default ChatInit;

function oldstuff() {

// Our interface to the Chat service
    var chatClient;

// A handle to the "general" chat channel - the one and only channel we
// will have in this sample app
    var generalChannel;

// The server will assign the client a random username - store that value
// here
    var username;

// Helper function to print info messages to the chat window
    function print(infoMessage, asHtml) {
        console.log(infoMessage);

    }

// Helper function to print chat message to the chat window
    function printMessage(fromUser, message) {
        console.log(fromUser + ' said: ', message);
    }

// Alert the user they have been assigned a random username
    print('Logging in...');

// Get an access token for the current user, passing a username (identity)
// and a device ID - for browser-based apps, we'll always just use the
// value "browser"


    fetch('/token')
        .then((response) => response.json())
        .then((data) => {

            // Alert the user they have been assigned a random username
            username = data.identity;
            console.log('You have been assigned a random username of: ' + username);

            // Initialize the Chat client
            chatClient = new Twilio.Chat.Client(data.token);
            chatClient.getSubscribedChannels().then(createOrJoinGeneralChannel);

            console.log('we are using fetch!');
        });


    function createOrJoinGeneralChannel() {
        // Get the general chat channel, which is where all the messages are
        // sent in this simple application
        print('Attempting to join "general" chat channel...');
        var promise = chatClient.getChannelByUniqueName('general');
        promise.then(function (channel) {
            generalChannel = channel;
            console.log('Found general channel:');
            console.log(generalChannel);
            setupChannel();
        }).catch(function () {
            // If it doesn't exist, let's create it
            console.log('Creating general channel');
            chatClient.createChannel({
                uniqueName: 'general',
                friendlyName: 'General Chat Channel'
            }).then(function (channel) {
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
        generalChannel.join().then(function (channel) {
            print('Joined channel as ' + username, false);

            loadFrame(chatClient, generalChannel);

        });

        // Listen for new messages sent to the channel
        generalChannel.on('messageAdded', function (message) {
            printMessage(message.author, message.body);
        });
    }


    function loadFrame(client, channel) {

        console.log('loading frame configuration');
        let frameConfiguration = {
            channel: {
                chrome: {
                    closeCallback: channelSid => {
                        chatFrame.unloadChannelBySid(channelSid);
                    }
                },
                header: {
                    visible: false,
                    image: {
                        visible: true,
                        url: 'https://1.gravatar.com/avatar/4dbc47147049d07f50d4c22bf8445ffc?s=30&d=mm&r=g'
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