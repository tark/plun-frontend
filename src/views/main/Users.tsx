import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import Divider from '@material-ui/core/Divider';
import {Skeleton} from '@material-ui/lab';
import {profileSelectors} from '../../store/slices/profile_slice';
import {fetchUsers} from '../../services/users_service';
import {usersSelectors} from '../../store/slices/users_slice';
import {moveToStart} from '../../util/list_util';
import './users.css';
import './main.css';

export default function Users() {

  const users = useSelector(usersSelectors.users)
  const selectedOrganization = useSelector(profileSelectors.selectedOrganization)
  const selectedProject = useSelector(profileSelectors.selectedProject)
  const profile = useSelector(profileSelectors.profile)
  const dispatch = useDispatch()

  useEffect(() => {
    if (selectedOrganization && selectedProject) {
      dispatch(fetchUsers({
        organizationName: selectedOrganization.name,
      }))
    }
  }, [selectedOrganization, selectedProject])

  return <div>
    <div className='users'>
      {users && moveToStart(users, u => u.email === profile?.email)?.map((u, i) => <div className='d-flex'>
        {i === 0 && <Divider orientation='vertical' style={{height: 48}}/>}
        <div className='user'>

          {!u.name && <div className='line-skeleton-container'>
            <Skeleton className='line-skeleton'/>
          </div>}

          {u.name && <div className='user_name'>{u.name}</div>}

        </div>
        <Divider orientation='vertical' style={{height: 48}}/>
      </div>)}
    </div>
    <Divider/>
  </div>

}
