import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {Header} from '@fox-zero/web/components/layout';
import moment from 'moment';
import {home} from '@fox-zero/content/data';

@connect(state => ({ content: state['@boilerplatejs/strapi'].Entry.content, params: state.router.params }))

export default class extends Header {
  static propTypes = {
    params: PropTypes.object,
    content: PropTypes.object
  };

  render() {
    const styles = require('./Component.scss');
    let { content, params } = this.props;
    content = content && params.slug ? content : home;

    return (
      <Header className={styles.slide} images={[content.media && content.media[0] ? content.media[0].url : require('./images/background.jpg')]}>
        <div>
          <div className={styles.title}>
            <h1>{content.name || content.title || 'FoxStream™'}</h1>
            <h2>{content.dek}</h2>
          </div>
          {content.author && <div className={styles.meta}>
            <span>By <strong>{content.author.username}</strong></span>
            <br />
            <span>Updated <strong>{moment(content.updated || content.updateAt).format('MMMM Do YYYY, h:mm a')}</strong></span>
            <br />
            <span>From <strong>{content.location}</strong></span>
          </div>}
          <div className="scroll">
            <button><span/></button>
          </div>
        </div>
      </Header>
    );
  }
}
