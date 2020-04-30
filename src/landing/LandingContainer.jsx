import {bindActionCreators} from 'redux'
import {connect} from 'react-redux'
import Landing from './MeetEntryFile'
import {fetchMeet} from '../../../actions'

const mapStateToProps = (state, ownProps) => {

  const {meetId} = ownProps.match.params
  const {meet, error} = state.meetsReducerNew

  return {
    meet,
    meetId,
    error,
  }

}

const mapDispatchToProps = dispatch => ({
  fetchMeet: bindActionCreators(fetchMeet, dispatch),
})

export default connect(mapStateToProps, mapDispatchToProps)(Landing)
