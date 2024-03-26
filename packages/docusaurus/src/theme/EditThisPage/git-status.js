import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faChevronDown, faHourglassHalf, faRotate } from '@fortawesome/free-solid-svg-icons';


const completed = "completed";
const inProgress = "in_progress";
const queued = "queued";
const waiting = "waiting"
const pending = "pending";
const update = "update";

export default function GithubStatus({octokit}) {
  const [githubActions, setGithubActions] = useState([]);
  const [lastUpdated, setLastUpdated] = useState();
  const [currentStatus, setCurrentStatus] = useState();

  useEffect(() => {
    const fetchData = async () => {
        const data = await octokit.getWorkflowRun();
        setGithubActions(data);
    };

    fetchData();
    // Call fetchData every 15 seconds
    const intervalId = setInterval(fetchData, 15000);
    // Cleanup function to clear the interval when the component unmounts
    return () => clearInterval(intervalId);
  }, []); 

  useEffect(() => {
    if(githubActions.length) {
      // Get most recent status
      const status = githubActions[0].status;
      if(status !== update) {
        setCurrentStatus(status);
      }
    }
    }, [githubActions]);

    useEffect(() => {
      if(githubActions.length) {

      const lastSuccess = githubActions.find(({conclusion}) => conclusion==="success");
      if(!!lastSuccess) {
        const timestamp = new Date(lastSuccess.updated_at).valueOf();
        if(!lastUpdated) {
          setLastUpdated(timestamp);
        } else if(timestamp > lastUpdated) {
          // force update
          setLastUpdated(timestamp);
          setCurrentStatus(update);
        }
      }
    }
  }, [githubActions, currentStatus, lastUpdated])


  return  (
    <>
      <StatusIndicator status={currentStatus} />
    </>
  )
}

const StatusIndicator = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case completed:
        return <FontAwesomeIcon icon={faCheck} style={{color: "#54f542"}}/>;
      case inProgress:
      case waiting:
      case queued:
      case pending:
        return <FontAwesomeIcon className='rotate-animation' icon={faHourglassHalf} style={{color: "#ffbd38"}}/>;
      case update:
        return <FontAwesomeIcon icon={faRotate} style={{color: "#ff0800"}}/>;
      default:
        return <FontAwesomeIcon icon={faChevronDown} />; // Default color for unknown status
    }
  };

  return (
    <div className="menu-select-icon">
      {getStatusIcon()}
    </div>
  );
};