import { tweetsData } from './data.js'
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

window.addEventListener('DOMContentLoaded', function() {
  const storedData = localStorage.getItem('tweetsData');
  if (storedData) {
    tweetsData.push(...JSON.parse(storedData));
  }
    // Set the initial mode
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setMode(isDarkMode);
  
    render();
});


document.addEventListener('click', function(e){
    if(e.target.dataset.like){
       handleLikeClick(e.target.dataset.like) 
    }
    else if(e.target.dataset.retweet){
        handleRetweetClick(e.target.dataset.retweet)
    }
    else if(e.target.dataset.reply){
        handleReplyClick(e.target.dataset.reply)
    }else if (e.target.dataset.delete) {
        handleDeleteClick(e.target.dataset.delete);
    } 
    else if(e.target.id === 'tweet-btn'){
        handleTweetBtnClick()
    }
})
 
function handleLikeClick(tweetId){ 
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]

    if (targetTweetObj.isLiked){
        targetTweetObj.likes--
    }
    else{
        targetTweetObj.likes++ 
    }
    targetTweetObj.isLiked = !targetTweetObj.isLiked
    saveToLocalStorage();
    render()
}

function handleRetweetClick(tweetId){
    const targetTweetObj = tweetsData.filter(function(tweet){
        return tweet.uuid === tweetId
    })[0]
    
    if(targetTweetObj.isRetweeted){
        targetTweetObj.retweets--
    }
    else{
        targetTweetObj.retweets++
    }
    targetTweetObj.isRetweeted = !targetTweetObj.isRetweeted
    saveToLocalStorage();
    render() 
}

function handleReplyClick(replyId){
     document.getElementById(`replies-${replyId}`).classList.toggle('hidden')

  }

  function handleReplyFormSubmit(tweetId) {
    const replyInput = document.getElementById(`reply-input-${tweetId}`);
    const replyText = replyInput.value;
  
    if (replyText) {
      const tweet = tweetsData.find((tweet) => tweet.uuid === tweetId);
      tweet.replies.unshift({
        handle: '@HR',
        profilePic: '/profilelogo.png',
        tweetText: replyText,
      });
  
      saveToLocalStorage();
      render();
      replyInput.value = '';
    }
  }

function handleDeleteClick(tweetId) {
    const tweetIndex = tweetsData.findIndex(function (tweet) {
        return tweet.uuid === tweetId;
    });

    if (tweetIndex !== -1) {
        tweetsData.splice(tweetIndex, 1);
        saveToLocalStorage();
        render();
    }
}

function handleTweetBtnClick(){
    const tweetInput = document.getElementById('tweet-input')

    if(tweetInput.value){
        tweetsData.unshift({
            handle: `@HR`,
            profilePic: `/profilelogo.png`,
            likes: 0,
            retweets: 0,
            tweetText: tweetInput.value,
            replies: [],
            isLiked: false,
            isRetweeted: false,
            uuid: uuidv4()
        })
    saveToLocalStorage();
    render()
    tweetInput.value = ''
    }

}

function getFeedHtml(){
    let feedHtml = ``
    
    tweetsData.forEach(function(tweet){
        
        let likeIconClass = ''
        
        if (tweet.isLiked){
            likeIconClass = 'liked'
        }
        
        let retweetIconClass = ''
        
        if (tweet.isRetweeted){
            retweetIconClass = 'retweeted'
        }
        
        let repliesHtml = ''
        
        if(tweet.replies.length > 0){
            tweet.replies.forEach(function(reply){
                repliesHtml+=`
<div class="tweet-reply">
    <div class="tweet-inner">
        <img src="${reply.profilePic}" class="profile-pic">
            <div>
                <p class="handle">${reply.handle}</p>
                <p class="tweet-text">${reply.tweetText}</p>
            </div>
        </div>
</div>
`
            })
        }

        feedHtml += `
<div class="tweet">
    <div class="tweet-inner">
        <img src="${tweet.profilePic}" class="profile-pic">
        <div>
            <p class="handle">${tweet.handle}</p>
            <p class="tweet-text">${tweet.tweetText}</p>
            <div class="tweet-details">
                <span class="tweet-detail">
                    <i class="fa-regular fa-comment-dots"
                    data-reply="${tweet.uuid}"
                    ></i>
                    ${tweet.replies.length}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-heart ${likeIconClass}"
                    data-like="${tweet.uuid}"
                    ></i>
                    ${tweet.likes}
                </span>
                <span class="tweet-detail">
                    <i class="fa-solid fa-retweet ${retweetIconClass}"
                    data-retweet="${tweet.uuid}"
                    ></i>
                    ${tweet.retweets}
                </span>
                <span class="tweet-detail">
                <i class="fa-regular fa-trash-alt delete-button"
                data-delete="${tweet.uuid}"
                ></i>
                </span>
            </div>   
        </div>            
    </div>
    <div class="hidden" id="replies-${tweet.uuid}">
        ${repliesHtml}
        <div class="reply-form">
            <textarea id="reply-input-${tweet.uuid}" class="reply-input" placeholder="Reply"></textarea>
            <button id="reply-btn" class="reply-submit" onclick="handleReplyFormSubmit('${tweet.uuid}')">Reply</button>
        </div>
    </div>
</div>
`
   })
   return feedHtml 
}

function render(){
    document.getElementById('feed').innerHTML = getFeedHtml()
    const toggleSwitch = document.getElementById('toggle');
    toggleSwitch.addEventListener('change', handleToggleSwitchChange);
  
    // Apply the appropriate class based on the initial state
    const isDarkMode = localStorage.getItem('isDarkMode') === 'true';
    setMode(isDarkMode);
}

function setMode(isDarkMode) {
  const body = document.body;
  body.classList.remove('light-mode', 'dark-mode');
  body.classList.add(isDarkMode ? 'dark-mode' : 'light-mode');
}

function handleToggleSwitchChange() {
  const isDarkMode = this.checked;
  localStorage.setItem('isDarkMode', isDarkMode);
  setMode(isDarkMode);
}

function saveToLocalStorage() {
  localStorage.setItem('tweetsData', JSON.stringify(tweetsData));
}
render()

