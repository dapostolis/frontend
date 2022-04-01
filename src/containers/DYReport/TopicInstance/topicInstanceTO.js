class TopicInstanceTO {

  constructor(id, topic, topicrevision, title, text, textposition, order, contenturl, imagechanged) {
    this.id = id;
    this.topic = topic;
    this.topicrevision = topicrevision;
    this.title = title;
    this.text = text;
    this.textposition = textposition;
    this.order = order;
    this.contenturl = contenturl;
    this.imagechanged = imagechanged;
  }

}

export default TopicInstanceTO;