function StartConnect() {

    async function fetchGraphQL(operationsDoc, operationName, variables) {
        const result = await fetch(
            "https://conenctusbackend.herokuapp.com/v1/graphql",
            {
                method: "POST",
                headers: {
                    "x-hasura-admin-secret": "82bebifa"
                },
                body: JSON.stringify({
                    query: operationsDoc,
                    variables: variables,
                    operationName: operationName
                })
            }
        );

        return await result.json();
    }
    const ip = ReturnCurrentIP()["ip"];
    const date = GetCurrentDateTime().toString();
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const channel = urlParams.get('number')
    const operationsDoc = `
  mutation MyMutation {
    insert_UsersHistory(objects: {UserChannel: "`+ channel + `", UserIP: "` + ip + `", UserTime: "` + date + `"}) {
      affected_rows
    }
  }
`;

    function executeMyMutation() {
        return fetchGraphQL(
            operationsDoc,
            "MyMutation",
            {}
        );
    }

    async function startExecuteMyMutation() {
        const { errors, data } = await executeMyMutation();

        if (errors) {
            // handle those errors like a pro
            console.error(errors);
        }

        // do something great with this precious data
        console.log(data);
    }



    async function ReturnCurrentIP() {
        return await $.ajax({
            type: "GET",
            url: "https://api.ipify.org?format=json",
            async: false
        }).responseJSON;
    }
    // get current data and time
    function GetCurrentDateTime() {
        var currentdate = new Date();
        var datetime = currentdate.getDate() + "/"
            + (currentdate.getMonth() + 1) + "/"
            + currentdate.getFullYear() + " @ "
            + currentdate.getHours() + ":"
            + currentdate.getMinutes() + ":"
            + currentdate.getSeconds();
        return datetime;
    }
    // Fetch a token from the Golang server.
    function fetchToken(uid, channelName, tokenRole) {

        return new Promise(function (resolve) {
            axios.post('https://give-token-for-voice-auth.herokuapp.com/fetch_rtc_token', {
                uid: uid,
                channelName: channelName,
                role: tokenRole
            }, {
                headers: {
                    'Content-Type': 'application/json; charset=UTF-8'
                }
            })
                .then(function (response) {
                    const token = response.data.token;
                    resolve(token);
                })
                .catch(function (error) {
                    console.log(error);
                });
        })
    }

    /*
     *  These procedures use Agora Voice Call SDK for Web to enable local and remote
     *  users to join and leave a Voice Call channel managed by Agora Platform.
     */

    /*
     *  Create an {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/v4.11.0/interfaces/iagorartcclient.html|AgoraRTCClient} instance.
     *
     * @param {string} mode - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/clientconfig.html#mode| streaming algorithm} used by Agora SDK.
     * @param  {string} codec - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/clientconfig.html#codec| client codec} used by the browser.
     */
    var client = AgoraRTC.createClient({ mode: "rtc", codec: "vp8" });

    /*
     * Create an AgoraRTCClient object.
     */
    var localTracks = {
        audioTrack: null
    };

    /*
     * On initiation no users are connected.
     */
    var remoteUsers = {};

    /*
     * On initiation. `client` is not attached to any project or channel for any specific user.
     */
    var options = {
        appid: null,
        channel: null,
        uid: null,
        token: null
    };

    AgoraRTC.onAutoplayFailed = () => {
        alert("click to start autoplay!")
    }

    AgoraRTC.onMicrophoneChanged = async (changedDevice) => {
        // When plugging in a device, switch to a device that is newly plugged in.
        if (changedDevice.state === "ACTIVE") {
            localTracks.audioTrack.setDevice(changedDevice.device.deviceId);
            // Switch to an existing device when the current device is unplugged.
        } else if (changedDevice.device.label === localTracks.audioTrack.getTrackLabel()) {
            const oldMicrophones = await AgoraRTC.getMicrophones();
            oldMicrophones[0] && localTracks.audioTrack.setDevice(oldMicrophones[0].deviceId);
        }
    }


    /*
     * When this page is called with parameters in the URL, this procedure
     * attempts to join a Call channel using those parameters.
     */
    // $(() => {
    //     var urlParams = new URL(location.href).searchParams;
    //     options.appid = urlParams.get("appid");
    //     options.channel = urlParams.get("channel");
    //     options.token = urlParams.get("token");
    //     options.uid = urlParams.get("uid");
    //     if (options.appid && options.channel) {
    //         $("#uid").val(options.uid);
    //         $("#appid").val(options.appid);
    //         $("#token").val(options.token);
    //         $("#channel").val(options.channel);
    //         $("#join-form").submit();
    //     }
    // })

    /*
     * When a user clicks Join or Leave in the HTML form, this procedure gathers the information
     * entered in the form and calls join asynchronously. The UI is updated to match the options entered
     * by the user.
     */
    function RandomNumber() {
        return Math.floor(Math.random() * 1000000)
    }
    async function connect(e) {
        try {
            options.appid = "aa6a5cb4cf69415da44bee880df16203";
            const queryString = window.location.search;
            const urlParams = new URLSearchParams(queryString);
            options.token = await fetchToken(options.uid, urlParams.get('number'), 1);
            // options.channel = $("#number").val();

            options.channel = urlParams.get('number');
            options.uid = RandomNumber();
            startExecuteMyMutation();
            await join();
            if (options.token) {
                $("#success-alert-with-token").css("display", "block");
            } else {
                $("#success-alert a").attr("href", `index.html?appid=${options.appid}&channel=${options.channel}&token=${options.token}`);
                $("#success-alert").css("display", "block");
            }
        } catch (error) {
            console.error(error);
        } finally {
            console.log("connected");
        }

    }
    async function refreshToken() {
        options.token = await fetchToken(options.uid, urlParams.get('number'), 1);
    }
    var t = setInterval(refreshToken, 5000);
    /*
     * Called when a user clicks Leave in order to exit a channel.
     */

    /*
     * Join a channel, then create local audio tracks and publish them to the channel.
     */
    async function join() {

        // Add an event listener to play remote tracks when remote user publishes.
        client.on("user-published", handleUserPublished);
        client.on("user-unpublished", handleUserUnpublished);

        // Join a channel and create local tracks. Best practice is to use Promise.all and run them concurrently.
        [options.uid, localTracks.audioTrack] = await Promise.all([
            // Join the channel.
            client.join(options.appid, options.channel, options.token || null, options.uid || null),
            // Create tracks to the local microphone and camera.
            AgoraRTC.createMicrophoneAudioTrack(),
        ]);

        // Publish the local audio tracks to the channel.
        await client.publish(Object.values(localTracks));
        console.log("publish success");
    }

    /*
     * Stop all local and remote tracks then leave the channel.
     */
    async function leave() {
        for (trackName in localTracks) {
            var track = localTracks[trackName];
            if (track) {
                track.stop();
                track.close();
                localTracks[trackName] = undefined;
            }
        }

        // Remove remote users and player views.
        remoteUsers = {};
        $("#remote-playerlist").html("");

        // leave the channel
        await client.leave();

        $("#local-player-name").text("");
        $("#join").attr("disabled", false);
        $("#leave").attr("disabled", true);
        console.log("client leaves channel success");
    }


    /*
     * Add the local use to a remote channel.
     *
     * @param  {IAgoraRTCRemoteUser} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to add.
     * @param {trackMediaType - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/itrack.html#trackmediatype | media type} to add.
     */
    async function subscribe(user, mediaType) {
        const uid = user.uid;
        // subscribe to a remote user
        await client.subscribe(user, mediaType);
        console.log("subscribe success");
        if (mediaType === 'audio') {
            user.audioTrack.play();
        }
    }

    /*
     * Add a user who has subscribed to the live channel to the local interface.
     *
     * @param  {IAgoraRTCRemoteUser} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to add.
     * @param {trackMediaType - The {@link https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/itrack.html#trackmediatype | media type} to add.
     */
    function handleUserPublished(user, mediaType) {
        const id = user.uid;
        remoteUsers[id] = user;
        subscribe(user, mediaType);
    }

    /*
     * Remove the user specified from the channel in the local interface.
     *
     * @param  {string} user - The {@link  https://docs.agora.io/en/Voice/API%20Reference/web_ng/interfaces/iagorartcremoteuser.html| remote user} to remove.
     */
    function handleUserUnpublished(user, mediaType) {
        if (mediaType === 'audio') {
            const id = user.uid;
            delete remoteUsers[id];
            $(`#player-wrapper-${id}`).remove();

        }
    }
}
setTimeout(StartConnect, 3000);
