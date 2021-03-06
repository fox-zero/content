import React from 'react';
import {PropTypes} from 'prop-types';
import {connect} from 'react-redux';
import {ShareButtons} from 'react-share';
import ReactGA from 'react-ga';
import {Section} from '@boilerplatejs/core/components/layout';
import {update} from '@boilerplatejs/hubspot/actions/Contact';
import {home} from '@fox-zero/content/data';
import * as forms from '@fox-zero/web/components/forms';

const HOST = 'https://foxzero.io';

const formatCollectionUrl = slug => `${HOST}/stream${slug ? `/${slug}` : ''}`;

const { FacebookShareButton, TwitterShareButton, EmailShareButton } = ShareButtons;

const RE_ANCHOR_MARKDOWN = /\[([^\]]*)\]\(([^\s|\)]*)(?:\s"([^\)]*)")?\)/g;

const CONTENT_NEWSLETTER = 'Join the FoxStream™ newsletter for project management tips, industry trends, free-to-use software, and more.';

@connect(state => ({
  params: state.router.params,
  collection: state['@boilerplatejs/strapi'].Entry.collections.content,
  list: state['@boilerplatejs/strapi'].Entry.collections.list
}), {update})

export default class extends Section {
  static propTypes = {
    params: PropTypes.object,
    collection: PropTypes.object,
    list: PropTypes.array
  };

  state = {
    contact: null,
    form: {
      message: null
    }
  };

  submit = values => {
    const { update } = this.props;
    const { email } = values;
    const ga = { category: 'Newsletter Form', action: 'Sign Up' };

    if (values.email) {
      ReactGA.event({ ...ga, label: 'Attempt' });

      update({
        newsletter: true,
        properties: {
          email,
          firstname: values.firstName,
          lastname: values.lastName
        }
      })
        .then(contact => this.setState({ contact, form: { message: null } }))
        .then(() => ReactGA.event({ ...ga, label: `Success` }))
        .catch(({message}) => this.setState({ form: { message } }));
    }
  };

  renderNewsletter(content) {
    const { contact, form } = this.state;
    const { message } = form;

    return <span>
      <h3>Newsletter</h3>
      <p>{content || CONTENT_NEWSLETTER}</p>
      {contact ? <div className="success">Thank you, {contact.firstname.value}, for your subscription.</div> : <forms.Contact submitText="Sign Up" onSubmit={this.submit}/>}
      {message && <div className="error">{message}</div>}
    </span>;
  }

  renderShare() {
    let { collection, params } = this.props;
    const { slug } = params;
    const url = formatCollectionUrl(slug);

    collection = collection && params.slug ? collection : home;

    return (<div className="share">
      <FacebookShareButton url={`${url}`}>
        <img src="/@fox-zero/web/images/facebook.png" />
      </FacebookShareButton>
      <TwitterShareButton url={`${url}`}>
        <img src="/@fox-zero/web/images/twitter.png" />
      </TwitterShareButton>
      <EmailShareButton url={`${url}`} subject={`Hello! ${collection.name}`} body={`${collection.summary}\n\n${url}\n\n`}>
        <img src="/@fox-zero/web/images/email.png" />
      </EmailShareButton>
    </div>);
  }

  render() {
    let { collection, params } = this.props;

    collection = collection && params.slug ? collection : home;

    return (
      <Section className={`post`}>
        <h1>{collection.name || 'FoxStream™'}</h1>
        <h2>{collection.dek}</h2>
        {collection.summary && <p className="summary" dangerouslySetInnerHTML={{__html: collection.summary.replace(RE_ANCHOR_MARKDOWN, '<a href="$2" title="$3" target="_blank">$1</a>')}} />}
        {this.renderShare()}
        <br />
        <article>
          <div className="newsletter text">
            {this.renderNewsletter()}
          </div>
        </article>
        {this.renderShare()}
        <p className="text-center humility">
          <small>© Fox Zero (a VitruvianTech® brand)</small>
        </p>
        <br />
      </Section>
    );
  }
}
