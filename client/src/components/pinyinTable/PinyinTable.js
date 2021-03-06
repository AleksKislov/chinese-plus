import React, { useEffect } from "react";
import tippy from "tippy.js";
import "tippy.js/dist/tippy.css"; // optional for styling
import { Helmet } from "react-helmet";
import { myAudioURL } from "../../constants/urls.json";

const PinyinTable = () => {
  useEffect(() => {
    loaded();
    // eslint-disable-next-line
  }, []);

  const loaded = () => {
    const tbody = document.querySelector("tbody");

    const tds = tbody.getElementsByTagName("td");
    const trs = tbody.getElementsByTagName("tr");

    const tableHead = document.querySelector("#tableHead2");
    const ths = tableHead.getElementsByTagName("th");

    let tdsArr = Array.from(tds);
    let trsArr = Array.from(trs);
    let thsArr = Array.from(ths);

    tdsArr.forEach((td, i) => {
      td.addEventListener("mouseover", (e) => {
        let ind = i % 36;

        for (let index = 0; index < 22; index++) {
          tdsArr[ind + index * 36].setAttribute("class", "highlighted");
        }
        thsArr[ind + 1].setAttribute("class", "highlighted");

        tdsArr[i].setAttribute("class", "highlightedItem");
      });

      td.addEventListener("mouseout", (e) => {
        let ind = i % 36;
        for (let index = 0; index < 22; index++) {
          tdsArr[ind + index * 36].classList.remove("highlighted");
        }
        thsArr[ind + 1].classList.remove("highlighted");

        tdsArr[i].classList.remove("highlightedItem");
      });
    });

    trsArr.forEach((tr, i) => {
      tr.addEventListener("mouseover", (e) => {
        trsArr[i].setAttribute("class", "highlighted");
      });

      tr.addEventListener("mouseout", (e) => {
        for (let index = 0; index < 22; index++) {
          trsArr[index].classList.remove("highlighted");
        }
      });
    });

    const pinyinToggler = document.getElementsByClassName("pinjin-toggler");
    let pinyinTogArr = Array.from(pinyinToggler);

    pinyinTogArr.forEach((el) => {
      let cont = el.parentNode.getElementsByClassName("dropdown-menu");
      cont[0].innerHTML = cont[0].innerHTML.replace(/data-pinyin/gi, "onclick");

      tippy(el, {
        content: `<ul class="pinyinTippy">${cont[0].innerHTML}</ul>`,
        allowHTML: true,
        trigger: "click",
        interactive: true,
        theme: "translucent",
        placement: "bottom",
      });
    });
  };

  return (
    <div className='row justify-content-center'>
      <Helmet>
        <meta charSet='utf-8' />
        <title>?????????????? ?????????????? ?? ???????????????? | Chinese+</title>
      </Helmet>
      <div className='col-auto'>
        <h1 className=''>?????????????? ?????????????? ?? ????????????????</h1>

        <div className='alert alert-dismissible alert-info'>
          <button type='button' className='close' data-dismiss='alert'>
            &times;
          </button>
          ???????????????? ???? ??????????, ?????????? ???????????????? ?????????????? ?????????????????? ??????????
        </div>

        <table className='table table-bordered table-responsive' id='table-pinjin'>
          <thead>
            <tr id='tableHead'>
              <th id='tableBlank'>&nbsp;</th>
              <th colSpan='5'>a</th>
              <th colSpan='3'>o</th>
              <th colSpan='5'>e</th>
              <th colSpan='10'>i</th>
              <th colSpan='9'>u</th>
              <th colSpan='4'>??</th>
            </tr>
            <tr id='tableHead2'>
              <th id='tableBlank'>&nbsp;</th>
              <th>a</th>
              <th>ai</th>
              <th>ao</th>
              <th>an</th>
              <th>ang</th>
              <th>o</th>
              <th>ong</th>
              <th>ou</th>
              <th>e</th>
              <th>ei</th>
              <th>en</th>
              <th>eng</th>
              <th>er</th>
              <th>i</th>
              <th>ia</th>
              <th>iao</th>
              <th>ie</th>
              <th>iou</th>
              <th>ian</th>
              <th>iang</th>
              <th>in</th>
              <th>ing</th>
              <th>iong</th>
              <th>u</th>
              <th>ua</th>
              <th>uo</th>
              <th>ui</th>
              <th>uai</th>
              <th>uan</th>
              <th>un</th>
              <th>uang</th>
              <th>ueng</th>
              <th>??</th>
              <th>??e</th>
              <th>??an</th>
              <th>??n</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th id='tableHead' scope='row'>
                -
              </th>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>a</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/a1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/a2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/a3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/a4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ai1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ai2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ai3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ai4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ao1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ao2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ao3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ao4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>an</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/an1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/an2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/an3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/an4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ang1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ang2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ang3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ang4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>o</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/o1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/o2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/o3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/o4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ong1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ong2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ong3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ong4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ou1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ou2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ou3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ou4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>e</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/e1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/e2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/e3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/e4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ei1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ei2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ei3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ei4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>en</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/en1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/en2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/en3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/en4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>eng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/eng1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/eng2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/eng3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/eng4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>er</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/er1.mp3').play(); return false;`}
                        type='button'
                      >
                        ??r
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/er2.mp3').play(); return false;`}
                        type='button'
                      >
                        ??r
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/er3.mp3').play(); return false;`}
                        type='button'
                      >
                        ??r
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/er4.mp3').play(); return false;`}
                        type='button'
                      >
                        ??r
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yi1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yi2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yi3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yi4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ya</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ya1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ya2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ya3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ya4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yao1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yao2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yao3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yao4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ye</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ye1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ye2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ye3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ye4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>you</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/you1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/you2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/you3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/you4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yan1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yan2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yan3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yan4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yang1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yang2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yang3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yang4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yin</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yin1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yin2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yin3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yin4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ying</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ying1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ying2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ying3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ying4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yong1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yong2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yong3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yong4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>wu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wu1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wu2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wu3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wu4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>wa</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wa1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wa2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wa3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wa4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>wo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wo1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wo2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wo3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wo4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>wei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wei1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wei2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wei3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wei4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>wai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wai1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wai2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wai3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wai4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>wan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wan1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wan2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wan3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wan4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>wen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wen1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wen2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wen3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wen4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>wang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wang1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wang2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wang3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wang4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>weng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/weng1.mp3').play(); return false;`}
                        type='button'
                      >
                        w??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/weng2.mp3').play(); return false;`}
                        type='button'
                      >
                        w??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/weng3.mp3').play(); return false;`}
                        type='button'
                      >
                        w??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/weng4.mp3').play(); return false;`}
                        type='button'
                      >
                        w??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yu1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yu2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yu3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yu4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yue</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yue1.mp3').play(); return false;`}
                        type='button'
                      >
                        yu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yue2.mp3').play(); return false;`}
                        type='button'
                      >
                        yu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yue3.mp3').play(); return false;`}
                        type='button'
                      >
                        yu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yue4.mp3').play(); return false;`}
                        type='button'
                      >
                        yu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        yu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        yu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        yu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        yu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>yun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yun1.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yun2.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yun3.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yun4.mp3').play(); return false;`}
                        type='button'
                      >
                        y??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                m
              </th>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ma</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ma1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ma2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ma3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ma4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        m??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mai2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mai3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mai4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mao1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mao2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mao3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mao4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>man</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/man1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/man2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/man3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/man4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mang1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mang2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mang3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mang4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mo1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mo2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mo3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mo4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mou1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mou2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mou3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        m??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>me</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/me0.mp3').play(); return false;`}
                        type='button'
                      >
                        me
                      </button>
                    </li>
                    <li>???????????? ?????????????? ??????</li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        m??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mei2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mei3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mei4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>men</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/men1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/men2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/men3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/men4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>meng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/meng1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/meng2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/meng3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/meng4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mi1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mi2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mi3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mi4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>miao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miao1.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miao2.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miao3.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miao4.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mie1.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mi??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mie4.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>miu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mi??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mi??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miu4.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mian2.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mian3.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mian4.mp3').play(); return false;`}
                        type='button'
                      >
                        mi??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>min</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/min1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/min2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/min3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/min4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ming</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ming1.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ming2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ming3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ming4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mu2.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mu3.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mu4.mp3').play(); return false;`}
                        type='button'
                      >
                        m??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                f
              </th>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>fa</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fa1.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fa2.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fa3.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fa4.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>fan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fan1.mp3').play(); return false;`}
                        type='button'
                      >
                        f??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fan2.mp3').play(); return false;`}
                        type='button'
                      >
                        f??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fan3.mp3').play(); return false;`}
                        type='button'
                      >
                        f??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fan4.mp3').play(); return false;`}
                        type='button'
                      >
                        f??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>fang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fang1.mp3').play(); return false;`}
                        type='button'
                      >
                        f??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fang2.mp3').play(); return false;`}
                        type='button'
                      >
                        f??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fang3.mp3').play(); return false;`}
                        type='button'
                      >
                        f??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fang4.mp3').play(); return false;`}
                        type='button'
                      >
                        f??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>fo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        f??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fo2.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        f??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        f??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>fou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        f??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        f??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fou3.mp3').play(); return false;`}
                        type='button'
                      >
                        f??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        f??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>fei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fei1.mp3').play(); return false;`}
                        type='button'
                      >
                        f??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fei2.mp3').play(); return false;`}
                        type='button'
                      >
                        f??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fei3.mp3').play(); return false;`}
                        type='button'
                      >
                        f??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fei4.mp3').play(); return false;`}
                        type='button'
                      >
                        f??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>fen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fen1.mp3').play(); return false;`}
                        type='button'
                      >
                        f??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fen2.mp3').play(); return false;`}
                        type='button'
                      >
                        f??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fen3.mp3').play(); return false;`}
                        type='button'
                      >
                        f??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fen4.mp3').play(); return false;`}
                        type='button'
                      >
                        f??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>feng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/feng1.mp3').play(); return false;`}
                        type='button'
                      >
                        f??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/feng2.mp3').play(); return false;`}
                        type='button'
                      >
                        f??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/feng3.mp3').play(); return false;`}
                        type='button'
                      >
                        f??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/feng4.mp3').play(); return false;`}
                        type='button'
                      >
                        f??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>fu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fu1.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fu2.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fu3.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fu4.mp3').play(); return false;`}
                        type='button'
                      >
                        f??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                b
              </th>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ba</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ba1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ba2.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ba3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ba4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bai1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bai2.mp3').play(); return false;`}
                        type='button'
                      >
                        b??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bai3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bai4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bao1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bao2.mp3').play(); return false;`}
                        type='button'
                      >
                        b??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bao3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bao4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ban</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ban1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        b??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ban3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ban4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bang1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bang3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bang4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bo1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bo2.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bo3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bo4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bei1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        b??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bei3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bei4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ben</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ben1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        b??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ben3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ben4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>beng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/beng1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/beng2.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/beng3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/beng4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bi1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bi2.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bi3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bi4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>biao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/biao1.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??o
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        bi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/biao3.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/biao4.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bie1.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bie2.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bie3.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bie4.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bian1.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        bi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bian3.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bian4.mp3').play(); return false;`}
                        type='button'
                      >
                        bi??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bin</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bin1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        b??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        b??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bin4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bing</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bing1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bing3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bing4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>bu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bu1.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bu2.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bu3.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bu4.mp3').play(); return false;`}
                        type='button'
                      >
                        b??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                p
              </th>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pa</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pa1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pa2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pa4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pai1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pai2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pai3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pai4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pao1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pao2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pao3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pao4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pan1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pan2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        p??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pan4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pang1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pang2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pang3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pang4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>po</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/po1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/po2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/po3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/po4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pou1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pou2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pou3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        p??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pei1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pei2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        p??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pei4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pen1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pen2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        p??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pen4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>peng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/peng1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/peng2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/peng3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/peng4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pi1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pi2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pi3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pi4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>piao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/piao1.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/piao2.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/piao3.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/piao4.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pie1.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pie3.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pie4.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pian1.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pian2.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pian3.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pian4.mp3').play(); return false;`}
                        type='button'
                      >
                        pi??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pin</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pin1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pin2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pin3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pin4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ping</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ping1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ping2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        p??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        p??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>pu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pu1.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pu2.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pu3.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pu4.mp3').play(); return false;`}
                        type='button'
                      >
                        p??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                d
              </th>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>da</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/da1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/da2.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/da3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/da4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dai1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dai3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dai4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dao1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dao2.mp3').play(); return false;`}
                        type='button'
                      >
                        d??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dao3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dao4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dan1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dan3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dan4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dang1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dang3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dang4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dong1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dong3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dong4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dou1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dou3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dou4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>de</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/de1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/de2.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dei3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>den</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/den4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>deng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/deng1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/deng3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/deng4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>di</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/di1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/di2.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/di3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/di4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>diao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/diao1.mp3').play(); return false;`}
                        type='button'
                      >
                        di??o
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        di??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/diao3.mp3').play(); return false;`}
                        type='button'
                      >
                        di??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/diao4.mp3').play(); return false;`}
                        type='button'
                      >
                        di??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>die</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/die1.mp3').play(); return false;`}
                        type='button'
                      >
                        di??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/die2.mp3').play(); return false;`}
                        type='button'
                      >
                        di??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        di??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        di??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>diu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/diu1.mp3').play(); return false;`}
                        type='button'
                      >
                        di??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        di??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        di??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        di??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dian1.mp3').play(); return false;`}
                        type='button'
                      >
                        di??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        di??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dian3.mp3').play(); return false;`}
                        type='button'
                      >
                        di??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dian4.mp3').play(); return false;`}
                        type='button'
                      >
                        di??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>ding</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ding1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ding3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ding4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>du</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/du1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/du2.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/du3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/du4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>duo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duo1.mp3').play(); return false;`}
                        type='button'
                      >
                        du??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duo2.mp3').play(); return false;`}
                        type='button'
                      >
                        du??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duo3.mp3').play(); return false;`}
                        type='button'
                      >
                        du??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duo4.mp3').play(); return false;`}
                        type='button'
                      >
                        du??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dui1.mp3').play(); return false;`}
                        type='button'
                      >
                        du??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        du??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        du??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dui4.mp3').play(); return false;`}
                        type='button'
                      >
                        du??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>duan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duan1.mp3').play(); return false;`}
                        type='button'
                      >
                        du??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        du??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duan3.mp3').play(); return false;`}
                        type='button'
                      >
                        du??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duan4.mp3').play(); return false;`}
                        type='button'
                      >
                        du??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>dun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dun1.mp3').play(); return false;`}
                        type='button'
                      >
                        d??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        d??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dun3.mp3').play(); return false;`}
                        type='button'
                      >
                        d??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dun4.mp3').play(); return false;`}
                        type='button'
                      >
                        d??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                t
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ta</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ta1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ta3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ta4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tai1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tai2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tai3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tai4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tao1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tao2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tao3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tao4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tan1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tan2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tan3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tan4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tang1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tang2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tang3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tang4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tong1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tong2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tong3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tong4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tou1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tou2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tou3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tou4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>te</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        t??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        t??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/te4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>teng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/teng1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/teng2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/teng4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ti</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ti1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ti2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ti3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ti4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tiao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tiao1.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tiao2.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tiao3.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tiao4.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tie1.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ti??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tie3.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tie4.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tian1.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tian2.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tian3.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tian4.mp3').play(); return false;`}
                        type='button'
                      >
                        ti??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ting</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ting1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ting2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ting3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ting4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tu1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tu2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tu3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tu4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tuo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuo1.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuo3.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tui1.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tui2.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tui3.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tui4.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        tu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>tun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tun1.mp3').play(); return false;`}
                        type='button'
                      >
                        t??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tun2.mp3').play(); return false;`}
                        type='button'
                      >
                        t??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tun3.mp3').play(); return false;`}
                        type='button'
                      >
                        t??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tun4.mp3').play(); return false;`}
                        type='button'
                      >
                        t??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                n
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>na</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/na1.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/na2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/na3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/na4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nai3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nai4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nao1.mp3').play(); return false;`}
                        type='button'
                      >
                        n??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nao2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nao3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nao4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nan1.mp3').play(); return false;`}
                        type='button'
                      >
                        n??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nan2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nan3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nan4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nang1.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nang2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nang3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nang4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nong2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nong4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nou2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nou4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ne</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ne2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ne4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nei3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nei4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nen4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>neng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/neng2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ni</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ni1.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ni2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ni3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ni4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>niao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ni??o
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ni??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niao3.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niao4.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nie1.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ni??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ni??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nie4.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>niu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niu1.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niu2.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niu3.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niu4.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nian1.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nian2.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nian3.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nian4.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>niang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ni??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niang2.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ni??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niang4.mp3').play(); return false;`}
                        type='button'
                      >
                        ni??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nin</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nin2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ning</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ning2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ning3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ning4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nu2.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nu3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nu4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nuo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        nu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        nu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        nu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        nu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>n??</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nv3.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nv4.mp3').play(); return false;`}
                        type='button'
                      >
                        n??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>n??e</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n????
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n????
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        n????
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nve4.mp3').play(); return false;`}
                        type='button'
                      >
                        n????
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                l
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>la</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/la1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/la2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/la3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/la4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lai2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lai3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lai4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lao1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lao2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lao3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lao4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lan2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lan3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lan4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lang1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lang2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lang3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lang4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>long</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/long2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/long3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/long4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lou1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lou2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lou3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lou4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>le</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/le1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/le4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lei1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lei2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lei3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lei4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>leng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/leng1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/leng2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/leng3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/leng4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>li</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/li1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/li2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/li3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/li4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lia</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        li??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        li??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lia3.mp3').play(); return false;`}
                        type='button'
                      >
                        li??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        li??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>liao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liao1.mp3').play(); return false;`}
                        type='button'
                      >
                        li??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liao2.mp3').play(); return false;`}
                        type='button'
                      >
                        li??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liao3.mp3').play(); return false;`}
                        type='button'
                      >
                        li??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liao4.mp3').play(); return false;`}
                        type='button'
                      >
                        li??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        li??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        li??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lie3.mp3').play(); return false;`}
                        type='button'
                      >
                        li??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lie4.mp3').play(); return false;`}
                        type='button'
                      >
                        li??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>liu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liu1.mp3').play(); return false;`}
                        type='button'
                      >
                        li??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liu2.mp3').play(); return false;`}
                        type='button'
                      >
                        li??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liu3.mp3').play(); return false;`}
                        type='button'
                      >
                        li??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liu4.mp3').play(); return false;`}
                        type='button'
                      >
                        li??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lian1.mp3').play(); return false;`}
                        type='button'
                      >
                        li??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lian2.mp3').play(); return false;`}
                        type='button'
                      >
                        li??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lian3.mp3').play(); return false;`}
                        type='button'
                      >
                        li??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lian4.mp3').play(); return false;`}
                        type='button'
                      >
                        li??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>liang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liang1.mp3').play(); return false;`}
                        type='button'
                      >
                        li??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liang2.mp3').play(); return false;`}
                        type='button'
                      >
                        li??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liang3.mp3').play(); return false;`}
                        type='button'
                      >
                        li??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liang4.mp3').play(); return false;`}
                        type='button'
                      >
                        li??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lin</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lin1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lin2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lin3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lin4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ling</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ling2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ling3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ling4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lu1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lu2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lu3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lu4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>luo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luo1.mp3').play(); return false;`}
                        type='button'
                      >
                        lu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luo2.mp3').play(); return false;`}
                        type='button'
                      >
                        lu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luo3.mp3').play(); return false;`}
                        type='button'
                      >
                        lu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luo4.mp3').play(); return false;`}
                        type='button'
                      >
                        lu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>luan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luan1.mp3').play(); return false;`}
                        type='button'
                      >
                        lu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luan2.mp3').play(); return false;`}
                        type='button'
                      >
                        lu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luan4.mp3').play(); return false;`}
                        type='button'
                      >
                        lu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lun1.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lun2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lun4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>l??</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lv2.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lv3.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lv4.mp3').play(); return false;`}
                        type='button'
                      >
                        l??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>l??e</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l????
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l????
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        l????
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lve4.mp3').play(); return false;`}
                        type='button'
                      >
                        l????
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                z
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>za</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/za1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/za2.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/za3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zai1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zai3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zai4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zao1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zao2.mp3').play(); return false;`}
                        type='button'
                      >
                        z??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zao3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zao4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zan1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zan2.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zan3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zan4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zang1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zang3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zang4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zong1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zong3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zong4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zou1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zou3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zou4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ze</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ze2.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ze4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zei2.mp3').play(); return false;`}
                        type='button'
                      >
                        z??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zen1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zen3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zen4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zeng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zeng1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zeng3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zeng4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zi1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zi2.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zi3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zi4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zu1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zu2.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zu3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zu4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zuo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuo1.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuo3.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zui1.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zui3.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zui4.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        zu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zun1.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        z??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zun3.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zun4.mp3').play(); return false;`}
                        type='button'
                      >
                        z??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                c
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ca</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ca1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ca3.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cai1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cai2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cai3.mp3').play(); return false;`}
                        type='button'
                      >
                        c??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cai4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cao1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cao2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cao3.mp3').play(); return false;`}
                        type='button'
                      >
                        c??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cao4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>can</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/can1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/can2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/can3.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/can4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cang1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cang2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cong1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cong2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cou4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ce</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ce4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cen1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cen2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ceng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ceng1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ceng2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ceng4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ci</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ci1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ci2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ci3.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ci4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cu1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cu2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        c??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cu4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cuo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuo1.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuo3.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cui1.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cui2.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cui3.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cui4.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        cu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cun1.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cun2.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cun3.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cun4.mp3').play(); return false;`}
                        type='button'
                      >
                        c??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                s
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sa</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sa1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sa3.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sa4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sai1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sai4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sao1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??o
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sao3.mp3').play(); return false;`}
                        type='button'
                      >
                        s??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sao4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>san</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/san1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/san3.mp3').play(); return false;`}
                        type='button'
                      >
                        s??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/san4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sang1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sang3.mp3').play(); return false;`}
                        type='button'
                      >
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sang4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>song</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/song1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/song3.mp3').play(); return false;`}
                        type='button'
                      >
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/song4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sou1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sou3.mp3').play(); return false;`}
                        type='button'
                      >
                        s??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sou4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>se</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/se4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sen1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>seng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/seng1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>si</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/si1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/si3.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/si4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>su</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/su1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/su2.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        s??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/su4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>suo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/suo1.mp3').play(); return false;`}
                        type='button'
                      >
                        su??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        su??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/suo3.mp3').play(); return false;`}
                        type='button'
                      >
                        su??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        su??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sui1.mp3').play(); return false;`}
                        type='button'
                      >
                        su??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sui2.mp3').play(); return false;`}
                        type='button'
                      >
                        su??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sui3.mp3').play(); return false;`}
                        type='button'
                      >
                        su??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sui4.mp3').play(); return false;`}
                        type='button'
                      >
                        su??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>suan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/suan1.mp3').play(); return false;`}
                        type='button'
                      >
                        su??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        su??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        su??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/suan4.mp3').play(); return false;`}
                        type='button'
                      >
                        su??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sun1.mp3').play(); return false;`}
                        type='button'
                      >
                        s??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sun2.mp3').play(); return false;`}
                        type='button'
                      >
                        s??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sun3.mp3').play(); return false;`}
                        type='button'
                      >
                        s??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sun4.mp3').play(); return false;`}
                        type='button'
                      >
                        s??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                zh
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zha</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zha1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zha2.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zha3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zha4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhai1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhai2.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhai3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhai4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhao1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhao2.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhao3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhao4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhan1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhan2.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhan3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhan4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhang1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhang3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhang4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhong1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhong3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhong4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhou1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhou2.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhou3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhou4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhe</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhe1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhe2.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhe3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhe4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zh??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zh??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zh??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhei4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhen1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhen3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhen4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zheng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zheng1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zheng3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zheng4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhi1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhi2.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhi3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhi4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhu1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhu2.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhu3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhu4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhua</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhua1.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhua3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhuo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuo1.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuo3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhui1.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhui3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhui4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhuai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuai1.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuai2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuai3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuai4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhun1.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhun3.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhun4.mp3').play(); return false;`}
                        type='button'
                      >
                        zh??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>zhuang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuang1.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuang3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuang4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhu??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                ch
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cha</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cha1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cha2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cha3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cha4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chai1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chai2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chai3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chai4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chao1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chao2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chao3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chao4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chan1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chan2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chan3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chan4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chang1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chang2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chang3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chang4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chong1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chong2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chong3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chong4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chou1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chou2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chou3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chou4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>che</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/che1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/che3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/che4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chen1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chen2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chen3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chen4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>cheng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cheng1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cheng2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cheng3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cheng4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chi1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chi2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chi3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chi4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chu1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chu2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chu3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chu4.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chua</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chua1.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chua2.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chua3.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chua4.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chuo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuo1.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chui1.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chui2.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chuai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuai1.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuai2.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuai3.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuai4.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chun1.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chun2.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chun3.mp3').play(); return false;`}
                        type='button'
                      >
                        ch??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ch??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>chuang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuang1.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuang2.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuang3.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuang4.mp3').play(); return false;`}
                        type='button'
                      >
                        chu??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                sh
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sha</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sha1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sha2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sha3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sha4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shai1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sh??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shai3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shai4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shao1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shao2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shao3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shao4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shan1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shan3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shan4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shang1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shang3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shang4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shou1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shou2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shou3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shou4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>she</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/she1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/she2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/she3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/she4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sh??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shei2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sh??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sh??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shen1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shen2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shen3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shen4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>sheng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sheng1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sheng2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sheng3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sheng4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shi1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shi2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shi3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shi4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shu1.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shu2.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shu3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shu4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shua</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shua1.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shua3.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shua4.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shuo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuo1.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shui1.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shui2.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shui3.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shui4.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shuai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuai1.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuai3.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuai4.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shun3.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shun4.mp3').play(); return false;`}
                        type='button'
                      >
                        sh??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>shuang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuang1.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuang3.mp3').play(); return false;`}
                        type='button'
                      >
                        shu??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shu??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                r
              </th>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>rao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rao2.mp3').play(); return false;`}
                        type='button'
                      >
                        r??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rao3.mp3').play(); return false;`}
                        type='button'
                      >
                        r??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rao4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ran</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ran2.mp3').play(); return false;`}
                        type='button'
                      >
                        r??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ran3.mp3').play(); return false;`}
                        type='button'
                      >
                        r??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>rang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rang1.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rang2.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rang3.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rang4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>rong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rong2.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rong3.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>rou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rou2.mp3').play(); return false;`}
                        type='button'
                      >
                        r??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rou4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>re</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/re3.mp3').play(); return false;`}
                        type='button'
                      >
                        r??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/re4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ren</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ren2.mp3').play(); return false;`}
                        type='button'
                      >
                        r??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ren3.mp3').play(); return false;`}
                        type='button'
                      >
                        r??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ren4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>reng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/reng1.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/reng2.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/reng4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ri</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ri4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ru</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ru2.mp3').play(); return false;`}
                        type='button'
                      >
                        r??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ru3.mp3').play(); return false;`}
                        type='button'
                      >
                        r??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ru4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ruo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ru??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ru??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ru??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ruo4.mp3').play(); return false;`}
                        type='button'
                      >
                        ru??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>rui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ru??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rui2.mp3').play(); return false;`}
                        type='button'
                      >
                        ru??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rui3.mp3').play(); return false;`}
                        type='button'
                      >
                        ru??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rui4.mp3').play(); return false;`}
                        type='button'
                      >
                        ru??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ruan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ru??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ru??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ruan3.mp3').play(); return false;`}
                        type='button'
                      >
                        ru??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ru??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>run</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        r??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/run4.mp3').play(); return false;`}
                        type='button'
                      >
                        r??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                j
              </th>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ji</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ji1.mp3').play(); return false;`}
                        type='button'
                      >
                        j??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ji2.mp3').play(); return false;`}
                        type='button'
                      >
                        j??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ji3.mp3').play(); return false;`}
                        type='button'
                      >
                        j??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ji4.mp3').play(); return false;`}
                        type='button'
                      >
                        j??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jia</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jia1.mp3').play(); return false;`}
                        type='button'
                      >
                        j??a
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jia2.mp3').play(); return false;`}
                        type='button'
                      >
                        j??a
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jia3.mp3').play(); return false;`}
                        type='button'
                      >
                        j??a
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jia4.mp3').play(); return false;`}
                        type='button'
                      >
                        j??a
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jiao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiao1.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiao2.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiao3.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiao4.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jie1.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jie2.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jie3.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jie4.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jiu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiu1.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiu2.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiu3.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiu4.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jian1.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ji??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jian3.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jian4.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jiang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiang1.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ji??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiang3.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiang4.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jin</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jin1.mp3').play(); return false;`}
                        type='button'
                      >
                        j??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        j??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jin3.mp3').play(); return false;`}
                        type='button'
                      >
                        j??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jin4.mp3').play(); return false;`}
                        type='button'
                      >
                        j??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jing</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jing1.mp3').play(); return false;`}
                        type='button'
                      >
                        j??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        j??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jing3.mp3').play(); return false;`}
                        type='button'
                      >
                        j??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jing4.mp3').play(); return false;`}
                        type='button'
                      >
                        j??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jiong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiong1.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ji??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiong3.mp3').play(); return false;`}
                        type='button'
                      >
                        ji??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ji??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ju</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ju1.mp3').play(); return false;`}
                        type='button'
                      >
                        j??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ju2.mp3').play(); return false;`}
                        type='button'
                      >
                        j??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ju3.mp3').play(); return false;`}
                        type='button'
                      >
                        j??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ju4.mp3').play(); return false;`}
                        type='button'
                      >
                        j??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jue</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jue1.mp3').play(); return false;`}
                        type='button'
                      >
                        ju??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jue2.mp3').play(); return false;`}
                        type='button'
                      >
                        ju??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jue3.mp3').play(); return false;`}
                        type='button'
                      >
                        ju??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jue4.mp3').play(); return false;`}
                        type='button'
                      >
                        ju??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>juan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/juan1.mp3').play(); return false;`}
                        type='button'
                      >
                        ju??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ju??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/juan3.mp3').play(); return false;`}
                        type='button'
                      >
                        ju??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/juan4.mp3').play(); return false;`}
                        type='button'
                      >
                        ju??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>jun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jun1.mp3').play(); return false;`}
                        type='button'
                      >
                        j??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        j??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        j??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jun4.mp3').play(); return false;`}
                        type='button'
                      >
                        j??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                q
              </th>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qi1.mp3').play(); return false;`}
                        type='button'
                      >
                        q??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qi2.mp3').play(); return false;`}
                        type='button'
                      >
                        q??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qi3.mp3').play(); return false;`}
                        type='button'
                      >
                        q??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qi4.mp3').play(); return false;`}
                        type='button'
                      >
                        q??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qia</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qia1.mp3').play(); return false;`}
                        type='button'
                      >
                        q??a
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qia2.mp3').play(); return false;`}
                        type='button'
                      >
                        q??a
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qia3.mp3').play(); return false;`}
                        type='button'
                      >
                        q??a
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qia4.mp3').play(); return false;`}
                        type='button'
                      >
                        q??a
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qiao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiao1.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiao2.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiao3.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiao4.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qie1.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qie2.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qie3.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qie4.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qiu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiu1.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiu2.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiu3.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qi??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qian1.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qian2.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qian3.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qian4.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qiang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiang1.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiang2.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiang3.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiang4.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qin</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qin1.mp3').play(); return false;`}
                        type='button'
                      >
                        q??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qin2.mp3').play(); return false;`}
                        type='button'
                      >
                        q??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qin3.mp3').play(); return false;`}
                        type='button'
                      >
                        q??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qin4.mp3').play(); return false;`}
                        type='button'
                      >
                        q??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qing</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qing1.mp3').play(); return false;`}
                        type='button'
                      >
                        q??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qing2.mp3').play(); return false;`}
                        type='button'
                      >
                        q??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qing3.mp3').play(); return false;`}
                        type='button'
                      >
                        q??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qing4.mp3').play(); return false;`}
                        type='button'
                      >
                        q??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qiong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qi??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiong2.mp3').play(); return false;`}
                        type='button'
                      >
                        qi??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qi??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qi??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qu1.mp3').play(); return false;`}
                        type='button'
                      >
                        q??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qu2.mp3').play(); return false;`}
                        type='button'
                      >
                        q??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qu3.mp3').play(); return false;`}
                        type='button'
                      >
                        q??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qu4.mp3').play(); return false;`}
                        type='button'
                      >
                        q??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>que</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/que1.mp3').play(); return false;`}
                        type='button'
                      >
                        qu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/que2.mp3').play(); return false;`}
                        type='button'
                      >
                        qu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/que4.mp3').play(); return false;`}
                        type='button'
                      >
                        qu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>quan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/quan1.mp3').play(); return false;`}
                        type='button'
                      >
                        qu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/quan2.mp3').play(); return false;`}
                        type='button'
                      >
                        qu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/quan3.mp3').play(); return false;`}
                        type='button'
                      >
                        qu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/quan4.mp3').play(); return false;`}
                        type='button'
                      >
                        qu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>qun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qun1.mp3').play(); return false;`}
                        type='button'
                      >
                        q??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qun2.mp3').play(); return false;`}
                        type='button'
                      >
                        q??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        q??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        q??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                x
              </th>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xi</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xi1.mp3').play(); return false;`}
                        type='button'
                      >
                        x??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xi2.mp3').play(); return false;`}
                        type='button'
                      >
                        x??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xi3.mp3').play(); return false;`}
                        type='button'
                      >
                        x??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xi4.mp3').play(); return false;`}
                        type='button'
                      >
                        x??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xia</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xia1.mp3').play(); return false;`}
                        type='button'
                      >
                        x??a
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xia2.mp3').play(); return false;`}
                        type='button'
                      >
                        x??a
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        x??a
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xia4.mp3').play(); return false;`}
                        type='button'
                      >
                        x??a
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xiao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiao1.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiao2.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiao3.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiao4.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xie</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xie1.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xie2.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xie3.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xie4.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xiu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiu1.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        xi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiu3.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiu4.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xian</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xian1.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xian2.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xian3.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xian4.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xiang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiang1.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiang2.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiang3.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiang4.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xin</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xin1.mp3').play(); return false;`}
                        type='button'
                      >
                        x??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xin2.mp3').play(); return false;`}
                        type='button'
                      >
                        x??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xin3.mp3').play(); return false;`}
                        type='button'
                      >
                        x??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xin4.mp3').play(); return false;`}
                        type='button'
                      >
                        x??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xing</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xing1.mp3').play(); return false;`}
                        type='button'
                      >
                        x??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xing2.mp3').play(); return false;`}
                        type='button'
                      >
                        x??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xing3.mp3').play(); return false;`}
                        type='button'
                      >
                        x??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xing4.mp3').play(); return false;`}
                        type='button'
                      >
                        x??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xiong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiong1.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiong2.mp3').play(); return false;`}
                        type='button'
                      >
                        xi??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        xi??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        xi??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xu1.mp3').play(); return false;`}
                        type='button'
                      >
                        x??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xu2.mp3').play(); return false;`}
                        type='button'
                      >
                        x??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xu3.mp3').play(); return false;`}
                        type='button'
                      >
                        x??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xu4.mp3').play(); return false;`}
                        type='button'
                      >
                        x??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xue</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xue1.mp3').play(); return false;`}
                        type='button'
                      >
                        xu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xue2.mp3').play(); return false;`}
                        type='button'
                      >
                        xu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xue3.mp3').play(); return false;`}
                        type='button'
                      >
                        xu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xue4.mp3').play(); return false;`}
                        type='button'
                      >
                        xu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        xu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        xu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        xu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        xu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>xun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xun1.mp3').play(); return false;`}
                        type='button'
                      >
                        x??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xun2.mp3').play(); return false;`}
                        type='button'
                      >
                        x??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        x??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xun4.mp3').play(); return false;`}
                        type='button'
                      >
                        x??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                g
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ga</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ga1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ga2.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ga3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ga4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gai1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gai3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gai4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gao1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??o
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gao3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gao4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gan1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gan3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gan4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gang1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gang3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gang4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gong1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gong3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gong4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gou1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gou3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gou4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ge</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ge1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ge2.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ge3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ge4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gei3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gen1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gen2.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gen3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gen4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>geng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/geng1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/geng2.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/geng3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/geng4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gu1.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gu3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gu4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gua</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gua1.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gua3.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gua4.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>guo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guo1.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guo2.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guo3.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guo4.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gui1.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gui3.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gui4.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>guai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guai1.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guai3.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guai4.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>guan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guan1.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guan3.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guan4.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>gun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        g??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gun3.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gun4.mp3').play(); return false;`}
                        type='button'
                      >
                        g??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>guang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guang1.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guang3.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guang4.mp3').play(); return false;`}
                        type='button'
                      >
                        gu??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                k
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ka</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ka1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ka3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kai1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kai2.mp3').play(); return false;`}
                        type='button'
                      >
                        k??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kai4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kao1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??o
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kao3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kao4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kan1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kan3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kan4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kang1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kang3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kang4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kong1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kong3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kong4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kou1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??u
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kou3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kou4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ke</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ke1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ke2.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ke3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ke4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ken</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ken3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ken4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>keng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/keng1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/keng2.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/keng3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/keng4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ku</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ku1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ku3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ku4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kua</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kua1.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ku??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kua3.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kua4.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kuo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ku??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ku??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ku??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kui1.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kui2.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kui3.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kui4.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kuai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ku??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ku??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuai3.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuai4.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kuan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuan1.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ku??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ku??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kun1.mp3').play(); return false;`}
                        type='button'
                      >
                        k??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        k??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kun3.mp3').play(); return false;`}
                        type='button'
                      >
                        k??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kun4.mp3').play(); return false;`}
                        type='button'
                      >
                        k??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>kuang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuang1.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuang2.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuang3.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuang4.mp3').play(); return false;`}
                        type='button'
                      >
                        ku??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr>
              <th id='tableHead' scope='row'>
                h
              </th>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>ha</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ha1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ha2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ha3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ha4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hai1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hai2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hai3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hai4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hao</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hao1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hao2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hao3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??o
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hao4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??o
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>han</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/han1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/han2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/han3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/han4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hang1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hang2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hang3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hang4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hong</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hong1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hong2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hong3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hong4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hou</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hou1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hou2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hou3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??u
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hou4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??u
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>he</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/he1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/he2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        h??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/he4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hei1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hei2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        h??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        h??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hen</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hen1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        h??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hen3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hen4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>heng</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/heng1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/heng2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        h??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/heng4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hu</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hu1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hu2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hu3.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hu4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hua</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hua1.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hua2.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hua4.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>huo</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huo1.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huo2.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huo3.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huo4.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hui</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hui1.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hui2.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hui3.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hui4.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>huai</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huai2.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??i
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hu??i
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huai4.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??i
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>huan</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huan1.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huan2.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huan3.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huan4.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>hun</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hun1.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hun2.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        h??n
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hun4.mp3').play(); return false;`}
                        type='button'
                      >
                        h??n
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>huang</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huang1.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huang2.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huang3.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??ng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huang4.mp3').play(); return false;`}
                        type='button'
                      >
                        hu??ng
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default PinyinTable;
