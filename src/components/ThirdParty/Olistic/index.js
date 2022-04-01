import React, {useEffect, useState} from 'react';
import olisticLogo from './logo-olistic.png';
import baseline1 from './baseline-security-24px.svg';
import baseline2 from './baseline-desktop_mac-24px.svg';
import baseline3 from './baseline-supervised_user_circle-24px.svg';
import requestdemo from './requestdemo.png';
import './index.css';
import {request} from 'constants/alias';
import {API} from '../../../constants/config';


function Olistic({authUser}) {

  const [contactSlice, setContactSlice] = useState(true);
  const [form, setForm] = useState({
    firstName: authUser.firstname,
    lastName: authUser.lastname,
    email: authUser.email,
  });

  useEffect(function () {
    let html = document.getElementsByTagName('html')[0];

    html.classList.add('olistic');

    return function () {
      html.classList.remove('olistic');
    }
  });

  function handleChange(event) {
    const target = event.target,
      {id, value} = target;

    setForm({
      ...form,
      [id]: value
    });
  }

  function handleSubmit() {
    request
      .post(`${API}3rdpartyapp/olistic`, form)
      .then(() => {

        setContactSlice(false);

      })
      .catch(error => console.log(error));
  }


  return (

    <div id="olistic-wrap">

      <header id="header" className="header">
        <div className="navbar ">
          <nav className="navbar-olistic">
            <div className="navbar__components row">
              <div className="navbar__components--brand-name col-4">
                <a href="https://olistic.io" target="_blank"><img src={olisticLogo} alt="Olistic logo"/></a>
              </div>

              <div className="navbar__components--actions col-8">
                <ul className="main-nav">
                  <li>
                    <a href="#contact" className="btn btn--blue btn--navigation">Request a demo</a>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </div>

        <div className="header__heading--box">
          <div className="header__heading-box--card">
            <p className="card-text">
              <strong>OLISTIC</strong> is a web based software solution designed
              to enable organizations to achieve all of the benefits possible from
              an enterprise risk management process. It has a friendly and
              intuitive user interface and supports multiple risk management
              domains. Its rich risk scenario library, available out of the box,
              enables it to be easily configured by business process owners. This
              offers significant time savings and reduced total cost of ownership
              over bespoke and toolkit based solutions.
            </p>
            <a href="#contact" className="btn-y btn--yellow">Request a demo</a>
          </div>
        </div>
      </header>


      <section id="whyolistic">

        <div className="whyolistic__heading-box">
          <h2 className="whyolistic__heading--title-h2">ENTERPRISE RISK ASSESSMENT</h2>
          <hr/>
          <h3 className="whyolistic__heading--title-h3">OLISTIC enables the management of risks <br/>
            across all operational domains of the company:</h3>
        </div>

        <div className="whyolistic__list">
          <div className="row whyolistic-row">
            <div className="col-4 whyolistic__card">
              <div className="whyolistic__card__image">
                <img src={baseline2} alt="" className="whyolistic__card__image--img"/>
              </div>

              <div className="whyolistic_card_title">COMPUTER SECURITY <br/> (CYBERSECURITY)</div>

              <div className="whyolistic__card__text">
                Covering technical vulnerabilities and exposures for computer software and hardware according to the
                US
                National Vulnerability Database.
              </div>
            </div>
            <div className="col-4  whyolistic__card">
              <div className="whyolistic__card__image">
                <img src={baseline1} alt="" className="whyolistic__card__image--img"/>
              </div>

              <div className="whyolistic_card_title">INFORMATION SECURITY</div>

              <div className="whyolistic__card__text">
                Including physical, logical, human resources, supply chain, system development, legal and compliance
                sub-domain according to international standards and best practices such as ISO 27001 and ISO 27005.
              </div>
            </div>
            <div className="col-4 whyolistic__card">
              <div className="whyolistic__card__image">
                <img src={baseline3} alt="" className="whyolistic__card__image--img"/>
              </div>

              <div className="whyolistic_card_title">PERSONALLY IDENTIFIABLE INFORMATION (PII) <br/> PRIVACY IMPACT
                ASSESSMENT
              </div>

              <div className="whyolistic__card__text">
                According to the requirements of the EU General Data Protection Regulation and national personal
                data
                management legislation.
              </div>
            </div>
          </div>
        </div>

      </section>


      <section id="features">

        <div className="whyolistic__heading-box">
          <h2 className="whyolistic__heading--title-h2">KEY FEATURES</h2>
          <hr/>
          <h3 className="whyolistic__heading--title-h3">OLISTIC features :</h3>
        </div>

        <div className="features__heading--box">
          <div className="features__heading-box--card">
            <p className="card-text">
              <ul className="arrow-list">
                <li>Advances Asset Manager</li>
                <li>Automated IT Asset Discovery <br/> & Vulnerability Identification</li>
                <li>Risk Scenario Library – <br/> Mitigating Controls</li>
                <li>Risk Assessment Execution <br/> And Comparative Analysis</li>
              </ul>
            </p>
            <a href="https://olistic.io" className="btn-y btn--yellow">Learn more</a>
          </div>
        </div>

      </section>


      <section id="contact">
        <div className="contact__heading-box">
          <h2 className="contact__heading--title-h2">CONTACT US</h2>
          <hr/>
          <h3 className="contact__heading--title-h3">Request a demo for OLISTIC platform</h3>
        </div>

        <div className="row">
          <div className="col-6">
            <img src={requestdemo} alt="Request Demo"/>
          </div>
          <div className="col-6">
            <form>
              <p className="text-field">Want a peak on the inside before settling into the platform? Request us a
                demo!</p>
              <div className="row" style={{    paddingLeft: 20}}>
                <div className="col-6">
                  <label className="label-field">Name <span className="star-required">*</span></label><br/>
                  <input id="firstName" className="input-field" type="text" required name="name" style={{    paddingLeft: 10}} onChange={handleChange}
                         value={form.firstName}/>
                </div>
                <div className="col-6">
                  <label className="label-field">Surname <span className="star-required">*</span></label><br/>
                  <input id="lastName" className="input-field" type="text" required name="surname" style={{    paddingLeft: 10}} onChange={handleChange}
                         value={form.lastName}/>
                </div>
              </div>

              <div className="mail-margin">
                <label className="label-field">E-mail <span className="star-required">*</span></label><br/>
                <input id="email" className="input-field" type="email" onChange={handleChange} required name="email" style={{    paddingLeft: 10}} value={form.email}/>
              </div>


              <a href="#" className="btn-y btn--yellow" onClick={handleSubmit}>Request a demo</a>
            </form>
          </div>
        </div>
      </section>


    </div>

  )
}

export default Olistic;