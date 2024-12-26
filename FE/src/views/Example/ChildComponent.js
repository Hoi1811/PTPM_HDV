import React from 'react';
import './Demo.scss'

class ChildComponent extends React.Component {

    state = {
        showJobs: false
    }
    handleShowHide = (state) => {
        this.setState({
            showJobs: !this.state.showJobs
        })
    }
    handleOnclickDelete = (job) => {
        console.log('>>> handleOnclickDelete: ', job)
        this.props.deleteJob(job)
    }
    render() { //du lieu chay vao
        // console.log('>>> check props: ', this.props)
        let { name, age, adress, arrJobs } = this.props;
        let { showJobs } = this.state;
        let check = showJobs === true ? 'showJobs = true' : 'showJobs = false';
        console.log('>>> check conditional: ', check)
        return (
            <>
                {showJobs === false ?
                    <div>
                        <button style={{ color: 'red' }}
                            onClick={() => this.handleShowHide()}>
                            show
                        </button>
                    </div>
                    :
                    <>
                        <div>chil component name: {name} -{age}-{adress}</div>
                        <div className='job-lists'>
                            {
                                arrJobs.map((item, index) => {

                                    return (
                                        <div key={item.id}>
                                            {item.title}-{item.salary}<></> <span onClick={() => this.handleOnclickDelete(item)}>X</span>
                                        </div>
                                    )
                                })
                            }
                        </div>
                        <div><button onClick={() => this.handleShowHide()}>Hide</button></div>
                    </>}
            </>

        )

    }
}
// const ChildComponent = (props) => {
//     console.log('>>>check child props,', props)
//     let { arrJobs } = props
//     return (
//         <>

//             <div className='job-lists'>
//                 {
//                     arrJobs.map((item, index) => {
//                         if (+item.salary >= 5000) {
//                             return (
//                                 <div key={item.id}>
//                                     {item.title}-{item.salary}
//                                 </div>
//                             )
//                         }
//                     })
//                 }
//             </div>
//         </>
//     )
// }
export default ChildComponent;