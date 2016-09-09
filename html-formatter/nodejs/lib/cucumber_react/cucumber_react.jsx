import React from "react"
import Immutable from "immutable"

const EMPTY_LIST = new Immutable.List()
const EMPTY_MAP = new Immutable.Map()

const Cucumber = ({sources}) =>
  <div>
    <h1>Cucumber HTML</h1>
    {Array.from(sources.keys()).map(uri => <GherkinDocument node={sources.get(uri)} uri={uri} key={uri}/>)}
  </div>

Cucumber.propTypes = {
  sources: React.PropTypes.instanceOf(Immutable.Map).isRequired
}

const GherkinDocument = ({node, uri}) =>
  <div>
    <Feature node={node.get('feature')} uri={uri} attachmentsByLine={node.get('attachments', EMPTY_MAP)}/>
  </div>

GherkinDocument.propTypes = {
  node: React.PropTypes.instanceOf(Immutable.Map).isRequired,
}

const Feature = ({node, uri, attachmentsByLine}) =>
  <div>
    <h2 className="feature"><span>{node.get('keyword')}: </span><span className="name">{node.get('name')}</span></h2>
    {Array.from(node.get('children')).map(child => {
      const line = child.getIn(['location', 'line'])
      const childId = `${uri}:${line}`
      return <Scenario node={child}
                       attachmentsByLine={attachmentsByLine}
                       id={childId}
                       key={childId}/>
    })}
  </div>

Feature.propTypes = {
  node: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  attachmentsByLine: React.PropTypes.instanceOf(Immutable.Map).isRequired
}

const Scenario = ({node, id, attachmentsByLine}) =>
  <div>
    <h3 className="scenario"><span>{node.get('keyword')}: </span><span className="name">{node.get('name')}</span></h3>
    <ol>
      {Array.from(node.get('steps')).map(step => {
        const line = step.getIn(['location', 'line'])
        const childId = `${id}:${line}`
        const attachments = attachmentsByLine.get(line, EMPTY_LIST)
        return <Step
          node={step}
          attachments={attachments}
          id={childId}
          key={childId}/>
      })}
    </ol>
  </div>


Scenario.propTypes = {
  node: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  attachmentsByLine: React.PropTypes.instanceOf(Immutable.Map).isRequired
}

const Step = ({node, id, attachments}) =>
  <li>
    <span className="step"><span>{node.get('keyword')}</span><span className="text">{node.get('text')}</span></span>
    {Array.from(attachments).map((attachment, n) => <Attachment
      attachment={attachment}
      key={`${id}@${n}`}/>)}
  </li>

Step.propTypes = {
  node: React.PropTypes.instanceOf(Immutable.Map).isRequired,
  attachments: React.PropTypes.instanceOf(Immutable.List).isRequired
}

const Attachment = ({attachment}) => {
  const mediaType = attachment.getIn(['media', 'type'])
  const mediaEncoding = attachment.getIn(['media', 'encoding'])
  const data = attachment.get('data')
  if (mediaType && mediaType.match(/^image\//) && mediaEncoding == 'base64') {
    const src = `data:${mediaType};${mediaEncoding},${data}`
    return <div className="attachment">
      <img src={src}/>
    </div>
  }
  return null
}

Attachment.propTypes = {
  attachment: React.PropTypes.instanceOf(Immutable.Map).isRequired
}

export {Cucumber, GherkinDocument, Feature, Scenario, Step, Attachment}