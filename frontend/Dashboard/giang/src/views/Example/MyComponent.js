import React from 'react';
import ChildComponent from './ChildComponent';
import AddComponent from './AddComponent';
/* 
JSX dung js trong the html, return block
state la memory luu lai trang thai
khong dung this.state.name = event.target.value; ma dung setstate
*/
class MyComponent extends React.Component {
    state = {

        arrJobs: [
            { id: 'abcJob1', title: 'developer', salary: '4500' },
            { id: 'abcJob2', title: 'tester', salary: '5500' },
            { id: 'abcJob3', title: 'develop', salary: '4540' }
        ]
    }
    addNewJob = (job) => {
        console.log('check job from parent:', job)
        // let currentJobs = this.state.arrJobs;
        // currentJobs.push(job)
        this.setState({
            arrJobs: [...this.state.arrJobs, job]
            // arrJobs: currentJobs
        })
    }
    deleteJob = (job) => {
        let currentJobs = this.state.arrJobs;
        currentJobs = currentJobs.filter(item => item.id !== job.id);
        this.setState({
            arrJobs: currentJobs
        })
    }
    // handleOnChangeName = (event) => {
    //     this.setState({
    //         name: event.target.value
    //         //channel : 'abc' gan gia tri nao thi dat mac dinh
    //     })
    // }
    // handleClickButton = () => {
    //     alert('click me')
    // }


    render() {
        console.log('>>> call render: ', this.state)
        return (
            <>
                <AddComponent
                    addNewJob={this.addNewJob}
                />
                { }

                <ChildComponent

                    arrJobs={this.state.arrJobs}
                    deleteJob={this.deleteJob}
                />
                {/*props: property truyen data tu cha xuong con */}
            </>

        )

    }
}
export default MyComponent;