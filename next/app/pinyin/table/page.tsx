"use client";
import { useEffect } from "react";
// import tippy from "tippy.js";
// import "tippy.js/dist/tippy.css"; // optional for styling
// import { myAudioURL } from "../../../helpers/constants/consts";
const myAudioURL = "";
export default function PinyinTable() {
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
      <div className='col-auto'>
        <h1 className=''>Таблица Пиньиня с Озвучкой</h1>

        <div className='alert alert-dismissible alert-info'>
          <button type='button' className='close' data-dismiss='alert'>
            &times;
          </button>
          Кликайте на слоги, чтобы услышать озвучку носителем языка
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
              <th colSpan='4'>ü</th>
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
              <th>ü</th>
              <th>üe</th>
              <th>üan</th>
              <th>ün</th>
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
                        ā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/a2.mp3').play(); return false;`}
                        type='button'
                      >
                        á
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/a3.mp3').play(); return false;`}
                        type='button'
                      >
                        ǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/a4.mp3').play(); return false;`}
                        type='button'
                      >
                        à
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
                        āi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ai2.mp3').play(); return false;`}
                        type='button'
                      >
                        ái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ai3.mp3').play(); return false;`}
                        type='button'
                      >
                        ǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ai4.mp3').play(); return false;`}
                        type='button'
                      >
                        ài
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
                        āo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ao2.mp3').play(); return false;`}
                        type='button'
                      >
                        áo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ao3.mp3').play(); return false;`}
                        type='button'
                      >
                        ǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ao4.mp3').play(); return false;`}
                        type='button'
                      >
                        ào
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
                        ān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/an2.mp3').play(); return false;`}
                        type='button'
                      >
                        án
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/an3.mp3').play(); return false;`}
                        type='button'
                      >
                        ǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/an4.mp3').play(); return false;`}
                        type='button'
                      >
                        àn
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
                        āng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ang2.mp3').play(); return false;`}
                        type='button'
                      >
                        áng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ang3.mp3').play(); return false;`}
                        type='button'
                      >
                        ǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ang4.mp3').play(); return false;`}
                        type='button'
                      >
                        àng
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
                        ō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/o2.mp3').play(); return false;`}
                        type='button'
                      >
                        ó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/o3.mp3').play(); return false;`}
                        type='button'
                      >
                        ǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/o4.mp3').play(); return false;`}
                        type='button'
                      >
                        ò
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
                        ōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ong2.mp3').play(); return false;`}
                        type='button'
                      >
                        óng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ong3.mp3').play(); return false;`}
                        type='button'
                      >
                        ǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ong4.mp3').play(); return false;`}
                        type='button'
                      >
                        òng
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
                        ōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ou2.mp3').play(); return false;`}
                        type='button'
                      >
                        óu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ou3.mp3').play(); return false;`}
                        type='button'
                      >
                        ǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ou4.mp3').play(); return false;`}
                        type='button'
                      >
                        òu
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
                        ē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/e2.mp3').play(); return false;`}
                        type='button'
                      >
                        é
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/e3.mp3').play(); return false;`}
                        type='button'
                      >
                        ě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/e4.mp3').play(); return false;`}
                        type='button'
                      >
                        è
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
                        ēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ei2.mp3').play(); return false;`}
                        type='button'
                      >
                        éi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ei3.mp3').play(); return false;`}
                        type='button'
                      >
                        ěi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ei4.mp3').play(); return false;`}
                        type='button'
                      >
                        èi
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
                        ēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/en2.mp3').play(); return false;`}
                        type='button'
                      >
                        én
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/en3.mp3').play(); return false;`}
                        type='button'
                      >
                        ěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/en4.mp3').play(); return false;`}
                        type='button'
                      >
                        èn
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
                        ēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/eng2.mp3').play(); return false;`}
                        type='button'
                      >
                        éng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/eng3.mp3').play(); return false;`}
                        type='button'
                      >
                        ěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/eng4.mp3').play(); return false;`}
                        type='button'
                      >
                        èng
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
                        ēr
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/er2.mp3').play(); return false;`}
                        type='button'
                      >
                        ér
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/er3.mp3').play(); return false;`}
                        type='button'
                      >
                        ěr
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/er4.mp3').play(); return false;`}
                        type='button'
                      >
                        èr
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
                        yī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yi2.mp3').play(); return false;`}
                        type='button'
                      >
                        yí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yi3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yi4.mp3').play(); return false;`}
                        type='button'
                      >
                        yì
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
                        yā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ya2.mp3').play(); return false;`}
                        type='button'
                      >
                        yá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ya3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ya4.mp3').play(); return false;`}
                        type='button'
                      >
                        yà
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
                        yāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yao2.mp3').play(); return false;`}
                        type='button'
                      >
                        yáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yao3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yao4.mp3').play(); return false;`}
                        type='button'
                      >
                        yào
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
                        yē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ye2.mp3').play(); return false;`}
                        type='button'
                      >
                        yé
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ye3.mp3').play(); return false;`}
                        type='button'
                      >
                        yě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ye4.mp3').play(); return false;`}
                        type='button'
                      >
                        yè
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
                        yōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/you2.mp3').play(); return false;`}
                        type='button'
                      >
                        yóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/you3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/you4.mp3').play(); return false;`}
                        type='button'
                      >
                        yòu
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
                        yān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yan2.mp3').play(); return false;`}
                        type='button'
                      >
                        yán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yan3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yan4.mp3').play(); return false;`}
                        type='button'
                      >
                        yàn
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
                        yāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yang2.mp3').play(); return false;`}
                        type='button'
                      >
                        yáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yang3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yang4.mp3').play(); return false;`}
                        type='button'
                      >
                        yàng
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
                        yīn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yin2.mp3').play(); return false;`}
                        type='button'
                      >
                        yín
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yin3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǐn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yin4.mp3').play(); return false;`}
                        type='button'
                      >
                        yìn
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
                        yīng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ying2.mp3').play(); return false;`}
                        type='button'
                      >
                        yíng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ying3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ying4.mp3').play(); return false;`}
                        type='button'
                      >
                        yìng
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
                        yōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yong2.mp3').play(); return false;`}
                        type='button'
                      >
                        yóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yong3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yong4.mp3').play(); return false;`}
                        type='button'
                      >
                        yòng
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
                        wū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wu2.mp3').play(); return false;`}
                        type='button'
                      >
                        wú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wu3.mp3').play(); return false;`}
                        type='button'
                      >
                        wǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wu4.mp3').play(); return false;`}
                        type='button'
                      >
                        wù
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
                        wā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wa2.mp3').play(); return false;`}
                        type='button'
                      >
                        wá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wa3.mp3').play(); return false;`}
                        type='button'
                      >
                        wǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wa4.mp3').play(); return false;`}
                        type='button'
                      >
                        wà
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
                        wō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wo2.mp3').play(); return false;`}
                        type='button'
                      >
                        wó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wo3.mp3').play(); return false;`}
                        type='button'
                      >
                        wǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wo4.mp3').play(); return false;`}
                        type='button'
                      >
                        wò
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
                        wēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wei2.mp3').play(); return false;`}
                        type='button'
                      >
                        wéi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wei3.mp3').play(); return false;`}
                        type='button'
                      >
                        wěi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wei4.mp3').play(); return false;`}
                        type='button'
                      >
                        wèi
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
                        wāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wai2.mp3').play(); return false;`}
                        type='button'
                      >
                        wái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wai3.mp3').play(); return false;`}
                        type='button'
                      >
                        wǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wai4.mp3').play(); return false;`}
                        type='button'
                      >
                        wài
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
                        wān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wan2.mp3').play(); return false;`}
                        type='button'
                      >
                        wán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wan3.mp3').play(); return false;`}
                        type='button'
                      >
                        wǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wan4.mp3').play(); return false;`}
                        type='button'
                      >
                        wàn
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
                        wēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wen2.mp3').play(); return false;`}
                        type='button'
                      >
                        wén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wen3.mp3').play(); return false;`}
                        type='button'
                      >
                        wěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wen4.mp3').play(); return false;`}
                        type='button'
                      >
                        wèn
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
                        wāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wang2.mp3').play(); return false;`}
                        type='button'
                      >
                        wáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wang3.mp3').play(); return false;`}
                        type='button'
                      >
                        wǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/wang4.mp3').play(); return false;`}
                        type='button'
                      >
                        wàng
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
                        wēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/weng2.mp3').play(); return false;`}
                        type='button'
                      >
                        wéng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/weng3.mp3').play(); return false;`}
                        type='button'
                      >
                        wěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/weng4.mp3').play(); return false;`}
                        type='button'
                      >
                        wèng
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
                        yū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yu2.mp3').play(); return false;`}
                        type='button'
                      >
                        yú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yu3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yu4.mp3').play(); return false;`}
                        type='button'
                      >
                        yù
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
                        yuē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yue2.mp3').play(); return false;`}
                        type='button'
                      >
                        yué
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yue3.mp3').play(); return false;`}
                        type='button'
                      >
                        yuě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yue4.mp3').play(); return false;`}
                        type='button'
                      >
                        yuè
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
                        yuān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        yuán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        yuǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        yuàn
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
                        yūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yun2.mp3').play(); return false;`}
                        type='button'
                      >
                        yún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yun3.mp3').play(); return false;`}
                        type='button'
                      >
                        yǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/yun4.mp3').play(); return false;`}
                        type='button'
                      >
                        yùn
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
                        mā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ma2.mp3').play(); return false;`}
                        type='button'
                      >
                        má
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ma3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ma4.mp3').play(); return false;`}
                        type='button'
                      >
                        mà
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
                        māi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mai2.mp3').play(); return false;`}
                        type='button'
                      >
                        mái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mai3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mai4.mp3').play(); return false;`}
                        type='button'
                      >
                        mài
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
                        māo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mao2.mp3').play(); return false;`}
                        type='button'
                      >
                        máo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mao3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mao4.mp3').play(); return false;`}
                        type='button'
                      >
                        mào
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
                        mān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/man2.mp3').play(); return false;`}
                        type='button'
                      >
                        mán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/man3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/man4.mp3').play(); return false;`}
                        type='button'
                      >
                        màn
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
                        māng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mang2.mp3').play(); return false;`}
                        type='button'
                      >
                        máng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mang3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mang4.mp3').play(); return false;`}
                        type='button'
                      >
                        màng
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
                        mō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mo2.mp3').play(); return false;`}
                        type='button'
                      >
                        mó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mo3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mo4.mp3').play(); return false;`}
                        type='button'
                      >
                        mò
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
                        mōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mou2.mp3').play(); return false;`}
                        type='button'
                      >
                        móu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mou3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǒu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mòu
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
                    <li>только нулевой тон</li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropdown'>
                  <div className='pinjin-toggler'>mei</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mei2.mp3').play(); return false;`}
                        type='button'
                      >
                        méi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mei3.mp3').play(); return false;`}
                        type='button'
                      >
                        měi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mei4.mp3').play(); return false;`}
                        type='button'
                      >
                        mèi
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
                        mēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/men2.mp3').play(); return false;`}
                        type='button'
                      >
                        mén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/men3.mp3').play(); return false;`}
                        type='button'
                      >
                        měn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/men4.mp3').play(); return false;`}
                        type='button'
                      >
                        mèn
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
                        mēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/meng2.mp3').play(); return false;`}
                        type='button'
                      >
                        méng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/meng3.mp3').play(); return false;`}
                        type='button'
                      >
                        měng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/meng4.mp3').play(); return false;`}
                        type='button'
                      >
                        mèng
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
                        mī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mi2.mp3').play(); return false;`}
                        type='button'
                      >
                        mí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mi3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mi4.mp3').play(); return false;`}
                        type='button'
                      >
                        mì
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
                        miāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miao2.mp3').play(); return false;`}
                        type='button'
                      >
                        miáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miao3.mp3').play(); return false;`}
                        type='button'
                      >
                        miǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miao4.mp3').play(); return false;`}
                        type='button'
                      >
                        miào
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
                        miē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        mié
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        miě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mie4.mp3').play(); return false;`}
                        type='button'
                      >
                        miè
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
                        miū
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        miú
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        miǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/miu4.mp3').play(); return false;`}
                        type='button'
                      >
                        miù
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
                        miān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mian2.mp3').play(); return false;`}
                        type='button'
                      >
                        mián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mian3.mp3').play(); return false;`}
                        type='button'
                      >
                        miǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mian4.mp3').play(); return false;`}
                        type='button'
                      >
                        miàn
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
                        mīn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/min2.mp3').play(); return false;`}
                        type='button'
                      >
                        mín
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/min3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǐn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/min4.mp3').play(); return false;`}
                        type='button'
                      >
                        mìn
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
                        mīng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ming2.mp3').play(); return false;`}
                        type='button'
                      >
                        míng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ming3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ming4.mp3').play(); return false;`}
                        type='button'
                      >
                        mìng
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
                        mū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mu2.mp3').play(); return false;`}
                        type='button'
                      >
                        mú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mu3.mp3').play(); return false;`}
                        type='button'
                      >
                        mǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/mu4.mp3').play(); return false;`}
                        type='button'
                      >
                        mù
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
                        fā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fa2.mp3').play(); return false;`}
                        type='button'
                      >
                        fá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fa3.mp3').play(); return false;`}
                        type='button'
                      >
                        fǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fa4.mp3').play(); return false;`}
                        type='button'
                      >
                        fà
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
                        fān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fan2.mp3').play(); return false;`}
                        type='button'
                      >
                        fán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fan3.mp3').play(); return false;`}
                        type='button'
                      >
                        fǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fan4.mp3').play(); return false;`}
                        type='button'
                      >
                        fàn
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
                        fāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fang2.mp3').play(); return false;`}
                        type='button'
                      >
                        fáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fang3.mp3').play(); return false;`}
                        type='button'
                      >
                        fǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fang4.mp3').play(); return false;`}
                        type='button'
                      >
                        fàng
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
                        fō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fo2.mp3').play(); return false;`}
                        type='button'
                      >
                        fó
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        fǒ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        fò
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
                        fōu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        fóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fou3.mp3').play(); return false;`}
                        type='button'
                      >
                        fǒu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        fòu
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
                        fēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fei2.mp3').play(); return false;`}
                        type='button'
                      >
                        féi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fei3.mp3').play(); return false;`}
                        type='button'
                      >
                        fěi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fei4.mp3').play(); return false;`}
                        type='button'
                      >
                        fèi
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
                        fēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fen2.mp3').play(); return false;`}
                        type='button'
                      >
                        fén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fen3.mp3').play(); return false;`}
                        type='button'
                      >
                        fěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fen4.mp3').play(); return false;`}
                        type='button'
                      >
                        fèn
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
                        fēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/feng2.mp3').play(); return false;`}
                        type='button'
                      >
                        féng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/feng3.mp3').play(); return false;`}
                        type='button'
                      >
                        fěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/feng4.mp3').play(); return false;`}
                        type='button'
                      >
                        fèng
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
                        fū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fu2.mp3').play(); return false;`}
                        type='button'
                      >
                        fú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fu3.mp3').play(); return false;`}
                        type='button'
                      >
                        fǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/fu4.mp3').play(); return false;`}
                        type='button'
                      >
                        fù
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
                        bā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ba2.mp3').play(); return false;`}
                        type='button'
                      >
                        bá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ba3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ba4.mp3').play(); return false;`}
                        type='button'
                      >
                        bà
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
                        bāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bai2.mp3').play(); return false;`}
                        type='button'
                      >
                        bái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bai3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bai4.mp3').play(); return false;`}
                        type='button'
                      >
                        bài
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
                        bāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bao2.mp3').play(); return false;`}
                        type='button'
                      >
                        báo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bao3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bao4.mp3').play(); return false;`}
                        type='button'
                      >
                        bào
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
                        bān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        bán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ban3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ban4.mp3').play(); return false;`}
                        type='button'
                      >
                        bàn
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
                        bāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        báng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bang3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bang4.mp3').play(); return false;`}
                        type='button'
                      >
                        bàng
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
                        bō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bo2.mp3').play(); return false;`}
                        type='button'
                      >
                        bó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bo3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bo4.mp3').play(); return false;`}
                        type='button'
                      >
                        bò
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
                        bēi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        béi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bei3.mp3').play(); return false;`}
                        type='button'
                      >
                        běi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bei4.mp3').play(); return false;`}
                        type='button'
                      >
                        bèi
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
                        bēn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        bén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ben3.mp3').play(); return false;`}
                        type='button'
                      >
                        běn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ben4.mp3').play(); return false;`}
                        type='button'
                      >
                        bèn
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
                        bēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/beng2.mp3').play(); return false;`}
                        type='button'
                      >
                        béng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/beng3.mp3').play(); return false;`}
                        type='button'
                      >
                        běng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/beng4.mp3').play(); return false;`}
                        type='button'
                      >
                        bèng
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
                        bī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bi2.mp3').play(); return false;`}
                        type='button'
                      >
                        bí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bi3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bi4.mp3').play(); return false;`}
                        type='button'
                      >
                        bì
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
                        biāo
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        biáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/biao3.mp3').play(); return false;`}
                        type='button'
                      >
                        biǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/biao4.mp3').play(); return false;`}
                        type='button'
                      >
                        biào
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
                        biē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bie2.mp3').play(); return false;`}
                        type='button'
                      >
                        bié
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bie3.mp3').play(); return false;`}
                        type='button'
                      >
                        biě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bie4.mp3').play(); return false;`}
                        type='button'
                      >
                        biè
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
                        biān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        bián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bian3.mp3').play(); return false;`}
                        type='button'
                      >
                        biǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bian4.mp3').play(); return false;`}
                        type='button'
                      >
                        biàn
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
                        bīn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        bín
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        bǐn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bin4.mp3').play(); return false;`}
                        type='button'
                      >
                        bìn
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
                        bīng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        bíng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bing3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bing4.mp3').play(); return false;`}
                        type='button'
                      >
                        bìng
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
                        bū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bu2.mp3').play(); return false;`}
                        type='button'
                      >
                        bú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bu3.mp3').play(); return false;`}
                        type='button'
                      >
                        bǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/bu4.mp3').play(); return false;`}
                        type='button'
                      >
                        bù
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
                        pā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pa2.mp3').play(); return false;`}
                        type='button'
                      >
                        pá
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pa4.mp3').play(); return false;`}
                        type='button'
                      >
                        pà
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
                        pāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pai2.mp3').play(); return false;`}
                        type='button'
                      >
                        pái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pai3.mp3').play(); return false;`}
                        type='button'
                      >
                        pǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pai4.mp3').play(); return false;`}
                        type='button'
                      >
                        pài
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
                        pāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pao2.mp3').play(); return false;`}
                        type='button'
                      >
                        páo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pao3.mp3').play(); return false;`}
                        type='button'
                      >
                        pǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pao4.mp3').play(); return false;`}
                        type='button'
                      >
                        pào
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
                        pān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pan2.mp3').play(); return false;`}
                        type='button'
                      >
                        pán
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pan4.mp3').play(); return false;`}
                        type='button'
                      >
                        pàn
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
                        pāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pang2.mp3').play(); return false;`}
                        type='button'
                      >
                        páng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pang3.mp3').play(); return false;`}
                        type='button'
                      >
                        pǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pang4.mp3').play(); return false;`}
                        type='button'
                      >
                        pàng
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
                        pō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/po2.mp3').play(); return false;`}
                        type='button'
                      >
                        pó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/po3.mp3').play(); return false;`}
                        type='button'
                      >
                        pǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/po4.mp3').play(); return false;`}
                        type='button'
                      >
                        pò
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
                        pōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pou2.mp3').play(); return false;`}
                        type='button'
                      >
                        póu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pou3.mp3').play(); return false;`}
                        type='button'
                      >
                        pǒu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pòu
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
                        pēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pei2.mp3').play(); return false;`}
                        type='button'
                      >
                        péi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pěi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pei4.mp3').play(); return false;`}
                        type='button'
                      >
                        pèi
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
                        pēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pen2.mp3').play(); return false;`}
                        type='button'
                      >
                        pén
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pen4.mp3').play(); return false;`}
                        type='button'
                      >
                        pèn
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
                        pēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/peng2.mp3').play(); return false;`}
                        type='button'
                      >
                        péng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/peng3.mp3').play(); return false;`}
                        type='button'
                      >
                        pěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/peng4.mp3').play(); return false;`}
                        type='button'
                      >
                        pèng
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
                        pī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pi2.mp3').play(); return false;`}
                        type='button'
                      >
                        pí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pi3.mp3').play(); return false;`}
                        type='button'
                      >
                        pǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pi4.mp3').play(); return false;`}
                        type='button'
                      >
                        pì
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
                        piāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/piao2.mp3').play(); return false;`}
                        type='button'
                      >
                        piáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/piao3.mp3').play(); return false;`}
                        type='button'
                      >
                        piǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/piao4.mp3').play(); return false;`}
                        type='button'
                      >
                        piào
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
                        piē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pié
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pie3.mp3').play(); return false;`}
                        type='button'
                      >
                        piě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pie4.mp3').play(); return false;`}
                        type='button'
                      >
                        piè
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
                        piān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pian2.mp3').play(); return false;`}
                        type='button'
                      >
                        pián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pian3.mp3').play(); return false;`}
                        type='button'
                      >
                        piǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pian4.mp3').play(); return false;`}
                        type='button'
                      >
                        piàn
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
                        pīn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pin2.mp3').play(); return false;`}
                        type='button'
                      >
                        pín
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pin3.mp3').play(); return false;`}
                        type='button'
                      >
                        pǐn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pin4.mp3').play(); return false;`}
                        type='button'
                      >
                        pìn
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
                        pīng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ping2.mp3').play(); return false;`}
                        type='button'
                      >
                        píng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pǐng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        pìng
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
                        pū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pu2.mp3').play(); return false;`}
                        type='button'
                      >
                        pú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pu3.mp3').play(); return false;`}
                        type='button'
                      >
                        pǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/pu4.mp3').play(); return false;`}
                        type='button'
                      >
                        pù
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
                        dā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/da2.mp3').play(); return false;`}
                        type='button'
                      >
                        dá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/da3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/da4.mp3').play(); return false;`}
                        type='button'
                      >
                        dà
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
                        dāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dai3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dai4.mp3').play(); return false;`}
                        type='button'
                      >
                        dài
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
                        dāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dao2.mp3').play(); return false;`}
                        type='button'
                      >
                        dáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dao3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dao4.mp3').play(); return false;`}
                        type='button'
                      >
                        dào
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
                        dān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dan3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dan4.mp3').play(); return false;`}
                        type='button'
                      >
                        dàn
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
                        dāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dang3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dang4.mp3').play(); return false;`}
                        type='button'
                      >
                        dàng
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
                        dōng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dong3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dong4.mp3').play(); return false;`}
                        type='button'
                      >
                        dòng
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
                        dōu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dou3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dou4.mp3').play(); return false;`}
                        type='button'
                      >
                        dòu
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
                        dē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/de2.mp3').play(); return false;`}
                        type='button'
                      >
                        dé
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dě
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dè
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
                        dēi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        déi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dei3.mp3').play(); return false;`}
                        type='button'
                      >
                        děi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dèi
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
                        dēn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dén
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        děn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/den4.mp3').play(); return false;`}
                        type='button'
                      >
                        dèn
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
                        dēng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        déng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/deng3.mp3').play(); return false;`}
                        type='button'
                      >
                        děng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/deng4.mp3').play(); return false;`}
                        type='button'
                      >
                        dèng
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
                        dī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/di2.mp3').play(); return false;`}
                        type='button'
                      >
                        dí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/di3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/di4.mp3').play(); return false;`}
                        type='button'
                      >
                        dì
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
                        diāo
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        diáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/diao3.mp3').play(); return false;`}
                        type='button'
                      >
                        diǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/diao4.mp3').play(); return false;`}
                        type='button'
                      >
                        diào
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
                        diē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/die2.mp3').play(); return false;`}
                        type='button'
                      >
                        dié
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        diě
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        diè
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
                        diū
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        diú
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        diǔ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        diù
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
                        diān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dian3.mp3').play(); return false;`}
                        type='button'
                      >
                        diǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dian4.mp3').play(); return false;`}
                        type='button'
                      >
                        diàn
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
                        dīng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        díng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ding3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ding4.mp3').play(); return false;`}
                        type='button'
                      >
                        dìng
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
                        dū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/du2.mp3').play(); return false;`}
                        type='button'
                      >
                        dú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/du3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/du4.mp3').play(); return false;`}
                        type='button'
                      >
                        dù
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
                        duō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duo2.mp3').play(); return false;`}
                        type='button'
                      >
                        duó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duo3.mp3').play(); return false;`}
                        type='button'
                      >
                        duǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duo4.mp3').play(); return false;`}
                        type='button'
                      >
                        duò
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
                        duī
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        duí
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        duǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dui4.mp3').play(); return false;`}
                        type='button'
                      >
                        duì
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
                        duān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        duán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duan3.mp3').play(); return false;`}
                        type='button'
                      >
                        duǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/duan4.mp3').play(); return false;`}
                        type='button'
                      >
                        duàn
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
                        dūn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        dún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dun3.mp3').play(); return false;`}
                        type='button'
                      >
                        dǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/dun4.mp3').play(); return false;`}
                        type='button'
                      >
                        dùn
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
                        tā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        tá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ta3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ta4.mp3').play(); return false;`}
                        type='button'
                      >
                        tà
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
                        tāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tai2.mp3').play(); return false;`}
                        type='button'
                      >
                        tái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tai3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tai4.mp3').play(); return false;`}
                        type='button'
                      >
                        tài
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
                        tāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tao2.mp3').play(); return false;`}
                        type='button'
                      >
                        táo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tao3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tao4.mp3').play(); return false;`}
                        type='button'
                      >
                        tào
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
                        tān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tan2.mp3').play(); return false;`}
                        type='button'
                      >
                        tán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tan3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tan4.mp3').play(); return false;`}
                        type='button'
                      >
                        tàn
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
                        tāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tang2.mp3').play(); return false;`}
                        type='button'
                      >
                        táng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tang3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tang4.mp3').play(); return false;`}
                        type='button'
                      >
                        tàng
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
                        tōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tong2.mp3').play(); return false;`}
                        type='button'
                      >
                        tóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tong3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tong4.mp3').play(); return false;`}
                        type='button'
                      >
                        tòng
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
                        tōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tou2.mp3').play(); return false;`}
                        type='button'
                      >
                        tóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tou3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tou4.mp3').play(); return false;`}
                        type='button'
                      >
                        tòu
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
                        tē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        té
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        tě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/te4.mp3').play(); return false;`}
                        type='button'
                      >
                        tè
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
                        tēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/teng2.mp3').play(); return false;`}
                        type='button'
                      >
                        téng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        těng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/teng4.mp3').play(); return false;`}
                        type='button'
                      >
                        tèng
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
                        tī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ti2.mp3').play(); return false;`}
                        type='button'
                      >
                        tí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ti3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ti4.mp3').play(); return false;`}
                        type='button'
                      >
                        tì
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
                        tiāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tiao2.mp3').play(); return false;`}
                        type='button'
                      >
                        tiáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tiao3.mp3').play(); return false;`}
                        type='button'
                      >
                        tiǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tiao4.mp3').play(); return false;`}
                        type='button'
                      >
                        tiào
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
                        tiē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        tié
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tie3.mp3').play(); return false;`}
                        type='button'
                      >
                        tiě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tie4.mp3').play(); return false;`}
                        type='button'
                      >
                        tiè
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
                        tiān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tian2.mp3').play(); return false;`}
                        type='button'
                      >
                        tián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tian3.mp3').play(); return false;`}
                        type='button'
                      >
                        tiǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tian4.mp3').play(); return false;`}
                        type='button'
                      >
                        tiàn
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
                        tīng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ting2.mp3').play(); return false;`}
                        type='button'
                      >
                        tíng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ting3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ting4.mp3').play(); return false;`}
                        type='button'
                      >
                        tìng
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
                        tū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tu2.mp3').play(); return false;`}
                        type='button'
                      >
                        tú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tu3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tu4.mp3').play(); return false;`}
                        type='button'
                      >
                        tù
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
                        tuō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        tuó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuo3.mp3').play(); return false;`}
                        type='button'
                      >
                        tuǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        tuò
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
                        tuī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tui2.mp3').play(); return false;`}
                        type='button'
                      >
                        tuí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tui3.mp3').play(); return false;`}
                        type='button'
                      >
                        tuǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tui4.mp3').play(); return false;`}
                        type='button'
                      >
                        tuì
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
                        tuān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        tuán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        tuǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        tuàn
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
                        tūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tun2.mp3').play(); return false;`}
                        type='button'
                      >
                        tún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tun3.mp3').play(); return false;`}
                        type='button'
                      >
                        tǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/tun4.mp3').play(); return false;`}
                        type='button'
                      >
                        tùn
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
                        nā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/na2.mp3').play(); return false;`}
                        type='button'
                      >
                        ná
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/na3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/na4.mp3').play(); return false;`}
                        type='button'
                      >
                        nà
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
                        nāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nai3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nai4.mp3').play(); return false;`}
                        type='button'
                      >
                        nài
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
                        nāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nao2.mp3').play(); return false;`}
                        type='button'
                      >
                        náo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nao3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nao4.mp3').play(); return false;`}
                        type='button'
                      >
                        nào
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
                        nān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nan2.mp3').play(); return false;`}
                        type='button'
                      >
                        nán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nan3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nan4.mp3').play(); return false;`}
                        type='button'
                      >
                        nàn
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
                        nāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nang2.mp3').play(); return false;`}
                        type='button'
                      >
                        náng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nang3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nang4.mp3').play(); return false;`}
                        type='button'
                      >
                        nàng
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
                        nōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nong2.mp3').play(); return false;`}
                        type='button'
                      >
                        nóng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nong4.mp3').play(); return false;`}
                        type='button'
                      >
                        nòng
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
                        nōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nou2.mp3').play(); return false;`}
                        type='button'
                      >
                        nóu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nou4.mp3').play(); return false;`}
                        type='button'
                      >
                        nòu
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
                        nē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ne2.mp3').play(); return false;`}
                        type='button'
                      >
                        né
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ně
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ne4.mp3').play(); return false;`}
                        type='button'
                      >
                        nè
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
                        nēi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        néi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nei3.mp3').play(); return false;`}
                        type='button'
                      >
                        něi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nei4.mp3').play(); return false;`}
                        type='button'
                      >
                        nèi
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
                        nēn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nén
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        něn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nen4.mp3').play(); return false;`}
                        type='button'
                      >
                        nèn
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
                        nēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/neng2.mp3').play(); return false;`}
                        type='button'
                      >
                        néng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        něng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nèng
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
                        nī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ni2.mp3').play(); return false;`}
                        type='button'
                      >
                        ní
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ni3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ni4.mp3').play(); return false;`}
                        type='button'
                      >
                        nì
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
                        niāo
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        niáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niao3.mp3').play(); return false;`}
                        type='button'
                      >
                        niǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niao4.mp3').play(); return false;`}
                        type='button'
                      >
                        niào
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
                        niē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nié
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        niě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nie4.mp3').play(); return false;`}
                        type='button'
                      >
                        niè
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
                        niū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niu2.mp3').play(); return false;`}
                        type='button'
                      >
                        niú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niu3.mp3').play(); return false;`}
                        type='button'
                      >
                        niǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niu4.mp3').play(); return false;`}
                        type='button'
                      >
                        niù
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
                        niān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nian2.mp3').play(); return false;`}
                        type='button'
                      >
                        nián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nian3.mp3').play(); return false;`}
                        type='button'
                      >
                        niǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nian4.mp3').play(); return false;`}
                        type='button'
                      >
                        niàn
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
                        niāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niang2.mp3').play(); return false;`}
                        type='button'
                      >
                        niáng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        niǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/niang4.mp3').play(); return false;`}
                        type='button'
                      >
                        niàng
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
                        nīn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nin2.mp3').play(); return false;`}
                        type='button'
                      >
                        nín
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nǐn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nìn
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
                        nīng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ning2.mp3').play(); return false;`}
                        type='button'
                      >
                        níng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ning3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ning4.mp3').play(); return false;`}
                        type='button'
                      >
                        nìng
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
                        nū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nu2.mp3').play(); return false;`}
                        type='button'
                      >
                        nú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nu3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nu4.mp3').play(); return false;`}
                        type='button'
                      >
                        nù
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
                        nuō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        nuó
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nuǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        nuò
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
                        nuān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nuán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        nuǎn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nuàn
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
                  <div className='pinjin-toggler'>nü</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nǖ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nǘ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nv3.mp3').play(); return false;`}
                        type='button'
                      >
                        nǚ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nv4.mp3').play(); return false;`}
                        type='button'
                      >
                        nǜ
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>nüe</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nüē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nüé
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        nüě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/nve4.mp3').play(); return false;`}
                        type='button'
                      >
                        nüè
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
                        lā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/la2.mp3').play(); return false;`}
                        type='button'
                      >
                        lá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/la3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/la4.mp3').play(); return false;`}
                        type='button'
                      >
                        là
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
                        lāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lai2.mp3').play(); return false;`}
                        type='button'
                      >
                        lái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lai3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lai4.mp3').play(); return false;`}
                        type='button'
                      >
                        lài
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
                        lāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lao2.mp3').play(); return false;`}
                        type='button'
                      >
                        láo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lao3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lao4.mp3').play(); return false;`}
                        type='button'
                      >
                        lào
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
                        lān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lan2.mp3').play(); return false;`}
                        type='button'
                      >
                        lán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lan3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lan4.mp3').play(); return false;`}
                        type='button'
                      >
                        làn
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
                        lāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lang2.mp3').play(); return false;`}
                        type='button'
                      >
                        láng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lang3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lang4.mp3').play(); return false;`}
                        type='button'
                      >
                        làng
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
                        lōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/long2.mp3').play(); return false;`}
                        type='button'
                      >
                        lóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/long3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/long4.mp3').play(); return false;`}
                        type='button'
                      >
                        lòng
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
                        lōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lou2.mp3').play(); return false;`}
                        type='button'
                      >
                        lóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lou3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lou4.mp3').play(); return false;`}
                        type='button'
                      >
                        lòu
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
                        lē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lé
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/le4.mp3').play(); return false;`}
                        type='button'
                      >
                        lè
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
                        lēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lei2.mp3').play(); return false;`}
                        type='button'
                      >
                        léi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lei3.mp3').play(); return false;`}
                        type='button'
                      >
                        lěi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lei4.mp3').play(); return false;`}
                        type='button'
                      >
                        lèi
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
                        lēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/leng2.mp3').play(); return false;`}
                        type='button'
                      >
                        léng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/leng3.mp3').play(); return false;`}
                        type='button'
                      >
                        lěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/leng4.mp3').play(); return false;`}
                        type='button'
                      >
                        lèng
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
                        lī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/li2.mp3').play(); return false;`}
                        type='button'
                      >
                        lí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/li3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/li4.mp3').play(); return false;`}
                        type='button'
                      >
                        lì
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
                        liā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        liá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lia3.mp3').play(); return false;`}
                        type='button'
                      >
                        liǎ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lià
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
                        liāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liao2.mp3').play(); return false;`}
                        type='button'
                      >
                        liáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liao3.mp3').play(); return false;`}
                        type='button'
                      >
                        liǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liao4.mp3').play(); return false;`}
                        type='button'
                      >
                        liào
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
                        liē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lié
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lie3.mp3').play(); return false;`}
                        type='button'
                      >
                        liě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lie4.mp3').play(); return false;`}
                        type='button'
                      >
                        liè
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
                        liū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liu2.mp3').play(); return false;`}
                        type='button'
                      >
                        liú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liu3.mp3').play(); return false;`}
                        type='button'
                      >
                        liǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liu4.mp3').play(); return false;`}
                        type='button'
                      >
                        liù
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
                        liān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lian2.mp3').play(); return false;`}
                        type='button'
                      >
                        lián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lian3.mp3').play(); return false;`}
                        type='button'
                      >
                        liǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lian4.mp3').play(); return false;`}
                        type='button'
                      >
                        liàn
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
                        liāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liang2.mp3').play(); return false;`}
                        type='button'
                      >
                        liáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liang3.mp3').play(); return false;`}
                        type='button'
                      >
                        liǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/liang4.mp3').play(); return false;`}
                        type='button'
                      >
                        liàng
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
                        līn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lin2.mp3').play(); return false;`}
                        type='button'
                      >
                        lín
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lin3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǐn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lin4.mp3').play(); return false;`}
                        type='button'
                      >
                        lìn
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
                        līng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ling2.mp3').play(); return false;`}
                        type='button'
                      >
                        líng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ling3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ling4.mp3').play(); return false;`}
                        type='button'
                      >
                        lìng
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
                        lū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lu2.mp3').play(); return false;`}
                        type='button'
                      >
                        lú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lu3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lu4.mp3').play(); return false;`}
                        type='button'
                      >
                        lù
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
                        luō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luo2.mp3').play(); return false;`}
                        type='button'
                      >
                        luó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luo3.mp3').play(); return false;`}
                        type='button'
                      >
                        luǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luo4.mp3').play(); return false;`}
                        type='button'
                      >
                        luò
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
                        luān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luan2.mp3').play(); return false;`}
                        type='button'
                      >
                        luán
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        luǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/luan4.mp3').play(); return false;`}
                        type='button'
                      >
                        luàn
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
                        lūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lun2.mp3').play(); return false;`}
                        type='button'
                      >
                        lún
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lun4.mp3').play(); return false;`}
                        type='button'
                      >
                        lùn
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lü</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lǖ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lv2.mp3').play(); return false;`}
                        type='button'
                      >
                        lǘ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lv3.mp3').play(); return false;`}
                        type='button'
                      >
                        lǚ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lv4.mp3').play(); return false;`}
                        type='button'
                      >
                        lǜ
                      </button>
                    </li>
                  </ul>
                </div>
              </td>
              <td>
                <div className='btn-group dropup'>
                  <div className='pinjin-toggler'>lüe</div>

                  <ul className='dropdown-menu'>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lüē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lüé
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        lüě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/lve4.mp3').play(); return false;`}
                        type='button'
                      >
                        lüè
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
                        zā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/za2.mp3').play(); return false;`}
                        type='button'
                      >
                        zá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/za3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǎ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zà
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
                        zāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zai3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zai4.mp3').play(); return false;`}
                        type='button'
                      >
                        zài
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
                        zāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zao2.mp3').play(); return false;`}
                        type='button'
                      >
                        záo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zao3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zao4.mp3').play(); return false;`}
                        type='button'
                      >
                        zào
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
                        zān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zan2.mp3').play(); return false;`}
                        type='button'
                      >
                        zán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zan3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zan4.mp3').play(); return false;`}
                        type='button'
                      >
                        zàn
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
                        zāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        záng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zang3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zang4.mp3').play(); return false;`}
                        type='button'
                      >
                        zàng
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
                        zōng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zong3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zong4.mp3').play(); return false;`}
                        type='button'
                      >
                        zòng
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
                        zōu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zou3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zou4.mp3').play(); return false;`}
                        type='button'
                      >
                        zòu
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
                        zē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ze2.mp3').play(); return false;`}
                        type='button'
                      >
                        zé
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ze4.mp3').play(); return false;`}
                        type='button'
                      >
                        zè
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
                        zēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zei2.mp3').play(); return false;`}
                        type='button'
                      >
                        zéi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zěi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zèi
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
                        zēn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zen3.mp3').play(); return false;`}
                        type='button'
                      >
                        zěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zen4.mp3').play(); return false;`}
                        type='button'
                      >
                        zèn
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
                        zēng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zéng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zeng3.mp3').play(); return false;`}
                        type='button'
                      >
                        zěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zeng4.mp3').play(); return false;`}
                        type='button'
                      >
                        zèng
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
                        zī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zi2.mp3').play(); return false;`}
                        type='button'
                      >
                        zí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zi3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zi4.mp3').play(); return false;`}
                        type='button'
                      >
                        zì
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
                        zū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zu2.mp3').play(); return false;`}
                        type='button'
                      >
                        zú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zu3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zu4.mp3').play(); return false;`}
                        type='button'
                      >
                        zù
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
                        zuō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        zuó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuo3.mp3').play(); return false;`}
                        type='button'
                      >
                        zuǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        zuò
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
                        zuī
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zuí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zui3.mp3').play(); return false;`}
                        type='button'
                      >
                        zuǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zui4.mp3').play(); return false;`}
                        type='button'
                      >
                        zuì
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
                        zuān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zuán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        zuǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        zuàn
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
                        zūn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zun3.mp3').play(); return false;`}
                        type='button'
                      >
                        zǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zun4.mp3').play(); return false;`}
                        type='button'
                      >
                        zùn
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
                        cā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ca3.mp3').play(); return false;`}
                        type='button'
                      >
                        cǎ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cà
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
                        cāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cai2.mp3').play(); return false;`}
                        type='button'
                      >
                        cái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cai3.mp3').play(); return false;`}
                        type='button'
                      >
                        cǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cai4.mp3').play(); return false;`}
                        type='button'
                      >
                        cài
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
                        cāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cao2.mp3').play(); return false;`}
                        type='button'
                      >
                        cáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cao3.mp3').play(); return false;`}
                        type='button'
                      >
                        cǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cao4.mp3').play(); return false;`}
                        type='button'
                      >
                        cào
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
                        cān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/can2.mp3').play(); return false;`}
                        type='button'
                      >
                        cán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/can3.mp3').play(); return false;`}
                        type='button'
                      >
                        cǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/can4.mp3').play(); return false;`}
                        type='button'
                      >
                        càn
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
                        cāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cang2.mp3').play(); return false;`}
                        type='button'
                      >
                        cáng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cǎng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        càng
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
                        cōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cong2.mp3').play(); return false;`}
                        type='button'
                      >
                        cóng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cǒng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        còng
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
                        cōu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cóu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cou4.mp3').play(); return false;`}
                        type='button'
                      >
                        còu
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
                        cē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cé
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ce4.mp3').play(); return false;`}
                        type='button'
                      >
                        cè
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
                        cēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cen2.mp3').play(); return false;`}
                        type='button'
                      >
                        cén
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cěn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cèn
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
                        cēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ceng2.mp3').play(); return false;`}
                        type='button'
                      >
                        céng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ceng4.mp3').play(); return false;`}
                        type='button'
                      >
                        cèng
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
                        cī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ci2.mp3').play(); return false;`}
                        type='button'
                      >
                        cí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ci3.mp3').play(); return false;`}
                        type='button'
                      >
                        cǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ci4.mp3').play(); return false;`}
                        type='button'
                      >
                        cì
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
                        cū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cu2.mp3').play(); return false;`}
                        type='button'
                      >
                        cú
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cu4.mp3').play(); return false;`}
                        type='button'
                      >
                        cù
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
                        cuō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        cuó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuo3.mp3').play(); return false;`}
                        type='button'
                      >
                        cuǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        cuò
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
                        cuī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cui2.mp3').play(); return false;`}
                        type='button'
                      >
                        cuí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cui3.mp3').play(); return false;`}
                        type='button'
                      >
                        cuǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cui4.mp3').play(); return false;`}
                        type='button'
                      >
                        cuì
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
                        cuān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        cuán
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        cuǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        cuàn
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
                        cūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cun2.mp3').play(); return false;`}
                        type='button'
                      >
                        cún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cun3.mp3').play(); return false;`}
                        type='button'
                      >
                        cǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cun4.mp3').play(); return false;`}
                        type='button'
                      >
                        cùn
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
                        sā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sa3.mp3').play(); return false;`}
                        type='button'
                      >
                        sǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sa4.mp3').play(); return false;`}
                        type='button'
                      >
                        sà
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
                        sāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sái
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sai4.mp3').play(); return false;`}
                        type='button'
                      >
                        sài
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
                        sāo
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sao3.mp3').play(); return false;`}
                        type='button'
                      >
                        sǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sao4.mp3').play(); return false;`}
                        type='button'
                      >
                        sào
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
                        sān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/san3.mp3').play(); return false;`}
                        type='button'
                      >
                        sǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/san4.mp3').play(); return false;`}
                        type='button'
                      >
                        sàn
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
                        sāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sang3.mp3').play(); return false;`}
                        type='button'
                      >
                        sǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sang4.mp3').play(); return false;`}
                        type='button'
                      >
                        sàng
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
                        sōng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/song3.mp3').play(); return false;`}
                        type='button'
                      >
                        sǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/song4.mp3').play(); return false;`}
                        type='button'
                      >
                        sòng
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
                        sōu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sou3.mp3').play(); return false;`}
                        type='button'
                      >
                        sǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sou4.mp3').play(); return false;`}
                        type='button'
                      >
                        sòu
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
                        sē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sé
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/se4.mp3').play(); return false;`}
                        type='button'
                      >
                        sè
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
                        sēn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sén
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sěn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sèn
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
                        sēng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        séng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sěng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sèng
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
                        sī
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/si3.mp3').play(); return false;`}
                        type='button'
                      >
                        sǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/si4.mp3').play(); return false;`}
                        type='button'
                      >
                        sì
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
                        sū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/su2.mp3').play(); return false;`}
                        type='button'
                      >
                        sú
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/su4.mp3').play(); return false;`}
                        type='button'
                      >
                        sù
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
                        suō
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        suó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/suo3.mp3').play(); return false;`}
                        type='button'
                      >
                        suǒ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        suò
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
                        suī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sui2.mp3').play(); return false;`}
                        type='button'
                      >
                        suí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sui3.mp3').play(); return false;`}
                        type='button'
                      >
                        suǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sui4.mp3').play(); return false;`}
                        type='button'
                      >
                        suì
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
                        suān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        suán
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        suǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/suan4.mp3').play(); return false;`}
                        type='button'
                      >
                        suàn
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
                        sūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sun2.mp3').play(); return false;`}
                        type='button'
                      >
                        sún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sun3.mp3').play(); return false;`}
                        type='button'
                      >
                        sǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sun4.mp3').play(); return false;`}
                        type='button'
                      >
                        sùn
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
                        zhā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zha2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zha3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zha4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhà
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
                        zhāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhai2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhai3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhai4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhài
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
                        zhāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhao2.mp3').play(); return false;`}
                        type='button'
                      >
                        zháo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhao3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhao4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhào
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
                        zhān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhan2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhan3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhan4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhàn
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
                        zhāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zháng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhang3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhang4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhàng
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
                        zhōng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhong3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhong4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhòng
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
                        zhōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhou2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhou3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhou4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhòu
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
                        zhē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhe2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhé
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhe3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhe4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhè
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
                        zhēi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhéi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhěi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhei4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhèi
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
                        zhēn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhen3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhen4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhèn
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
                        zhēng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhéng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zheng3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zheng4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhèng
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
                        zhī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhi2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhi3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhi4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhì
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
                        zhū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhu2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhu3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhu4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhù
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
                        zhuā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhuá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhua3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuǎ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhuà
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
                        zhuō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuo2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuo3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuò
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
                        zhuī
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhuí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhui3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhui4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuì
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
                        zhuāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuai2.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuai3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuai4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuài
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
                        zhuān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhuán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuàn
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
                        zhūn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhun3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhun4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhùn
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
                        zhuāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        zhuáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuang3.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/zhuang4.mp3').play(); return false;`}
                        type='button'
                      >
                        zhuàng
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
                        chā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cha2.mp3').play(); return false;`}
                        type='button'
                      >
                        chá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cha3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cha4.mp3').play(); return false;`}
                        type='button'
                      >
                        chà
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
                        chāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chai2.mp3').play(); return false;`}
                        type='button'
                      >
                        chái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chai3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chai4.mp3').play(); return false;`}
                        type='button'
                      >
                        chài
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
                        chāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chao2.mp3').play(); return false;`}
                        type='button'
                      >
                        cháo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chao3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chao4.mp3').play(); return false;`}
                        type='button'
                      >
                        chào
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
                        chān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chan2.mp3').play(); return false;`}
                        type='button'
                      >
                        chán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chan3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chan4.mp3').play(); return false;`}
                        type='button'
                      >
                        chàn
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
                        chāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chang2.mp3').play(); return false;`}
                        type='button'
                      >
                        cháng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chang3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chang4.mp3').play(); return false;`}
                        type='button'
                      >
                        chàng
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
                        chōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chong2.mp3').play(); return false;`}
                        type='button'
                      >
                        chóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chong3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chong4.mp3').play(); return false;`}
                        type='button'
                      >
                        chòng
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
                        chōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chou2.mp3').play(); return false;`}
                        type='button'
                      >
                        chóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chou3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chou4.mp3').play(); return false;`}
                        type='button'
                      >
                        chòu
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
                        chē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ché
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/che3.mp3').play(); return false;`}
                        type='button'
                      >
                        chě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/che4.mp3').play(); return false;`}
                        type='button'
                      >
                        chè
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
                        chēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chen2.mp3').play(); return false;`}
                        type='button'
                      >
                        chén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chen3.mp3').play(); return false;`}
                        type='button'
                      >
                        chěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chen4.mp3').play(); return false;`}
                        type='button'
                      >
                        chèn
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
                        chēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cheng2.mp3').play(); return false;`}
                        type='button'
                      >
                        chéng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cheng3.mp3').play(); return false;`}
                        type='button'
                      >
                        chěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/cheng4.mp3').play(); return false;`}
                        type='button'
                      >
                        chèng
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
                        chī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chi2.mp3').play(); return false;`}
                        type='button'
                      >
                        chí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chi3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chi4.mp3').play(); return false;`}
                        type='button'
                      >
                        chì
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
                        chū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chu2.mp3').play(); return false;`}
                        type='button'
                      >
                        chú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chu3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chu4.mp3').play(); return false;`}
                        type='button'
                      >
                        chù
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
                        chuā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chua2.mp3').play(); return false;`}
                        type='button'
                      >
                        chuá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chua3.mp3').play(); return false;`}
                        type='button'
                      >
                        chuǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chua4.mp3').play(); return false;`}
                        type='button'
                      >
                        chuà
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
                        chuō
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chuó
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chuǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        chuò
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
                        chuī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chui2.mp3').play(); return false;`}
                        type='button'
                      >
                        chuí
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chuǐ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chuì
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
                        chuāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuai2.mp3').play(); return false;`}
                        type='button'
                      >
                        chuái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuai3.mp3').play(); return false;`}
                        type='button'
                      >
                        chuǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuai4.mp3').play(); return false;`}
                        type='button'
                      >
                        chuài
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
                        chuān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        chuán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        chuǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        chuàn
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
                        chūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chun2.mp3').play(); return false;`}
                        type='button'
                      >
                        chún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chun3.mp3').play(); return false;`}
                        type='button'
                      >
                        chǔn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        chùn
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
                        chuāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuang2.mp3').play(); return false;`}
                        type='button'
                      >
                        chuáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuang3.mp3').play(); return false;`}
                        type='button'
                      >
                        chuǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/chuang4.mp3').play(); return false;`}
                        type='button'
                      >
                        chuàng
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
                        shā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sha2.mp3').play(); return false;`}
                        type='button'
                      >
                        shá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sha3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sha4.mp3').play(); return false;`}
                        type='button'
                      >
                        shà
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
                        shāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shai3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shai4.mp3').play(); return false;`}
                        type='button'
                      >
                        shài
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
                        shāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shao2.mp3').play(); return false;`}
                        type='button'
                      >
                        sháo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shao3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shao4.mp3').play(); return false;`}
                        type='button'
                      >
                        shào
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
                        shān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shan3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shan4.mp3').play(); return false;`}
                        type='button'
                      >
                        shàn
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
                        shāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        sháng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shang3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shang4.mp3').play(); return false;`}
                        type='button'
                      >
                        shàng
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
                        shōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shou2.mp3').play(); return false;`}
                        type='button'
                      >
                        shóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shou3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shou4.mp3').play(); return false;`}
                        type='button'
                      >
                        shòu
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
                        shē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/she2.mp3').play(); return false;`}
                        type='button'
                      >
                        shé
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/she3.mp3').play(); return false;`}
                        type='button'
                      >
                        shě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/she4.mp3').play(); return false;`}
                        type='button'
                      >
                        shè
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
                        shēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shei2.mp3').play(); return false;`}
                        type='button'
                      >
                        shéi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shěi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shèi
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
                        shēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shen2.mp3').play(); return false;`}
                        type='button'
                      >
                        shén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shen3.mp3').play(); return false;`}
                        type='button'
                      >
                        shěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shen4.mp3').play(); return false;`}
                        type='button'
                      >
                        shèn
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
                        shēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sheng2.mp3').play(); return false;`}
                        type='button'
                      >
                        shéng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sheng3.mp3').play(); return false;`}
                        type='button'
                      >
                        shěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/sheng4.mp3').play(); return false;`}
                        type='button'
                      >
                        shèng
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
                        shī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shi2.mp3').play(); return false;`}
                        type='button'
                      >
                        shí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shi3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shi4.mp3').play(); return false;`}
                        type='button'
                      >
                        shì
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
                        shū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shu2.mp3').play(); return false;`}
                        type='button'
                      >
                        shú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shu3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shu4.mp3').play(); return false;`}
                        type='button'
                      >
                        shù
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
                        shuā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shuá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shua3.mp3').play(); return false;`}
                        type='button'
                      >
                        shuǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shua4.mp3').play(); return false;`}
                        type='button'
                      >
                        shuà
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
                        shuō
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shuó
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shuǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        shuò
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
                        shuī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shui2.mp3').play(); return false;`}
                        type='button'
                      >
                        shuí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shui3.mp3').play(); return false;`}
                        type='button'
                      >
                        shuǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shui4.mp3').play(); return false;`}
                        type='button'
                      >
                        shuì
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
                        shuāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shuái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuai3.mp3').play(); return false;`}
                        type='button'
                      >
                        shuǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuai4.mp3').play(); return false;`}
                        type='button'
                      >
                        shuài
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
                        shuān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shuán
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shuǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        shuàn
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
                        shūn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shun3.mp3').play(); return false;`}
                        type='button'
                      >
                        shǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shun4.mp3').play(); return false;`}
                        type='button'
                      >
                        shùn
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
                        shuāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shuáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/shuang3.mp3').play(); return false;`}
                        type='button'
                      >
                        shuǎng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        shuàng
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
                        rāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rao2.mp3').play(); return false;`}
                        type='button'
                      >
                        ráo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rao3.mp3').play(); return false;`}
                        type='button'
                      >
                        rǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rao4.mp3').play(); return false;`}
                        type='button'
                      >
                        rào
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
                        rān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ran2.mp3').play(); return false;`}
                        type='button'
                      >
                        rán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ran3.mp3').play(); return false;`}
                        type='button'
                      >
                        rǎn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ràn
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
                        rāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rang2.mp3').play(); return false;`}
                        type='button'
                      >
                        ráng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rang3.mp3').play(); return false;`}
                        type='button'
                      >
                        rǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rang4.mp3').play(); return false;`}
                        type='button'
                      >
                        ràng
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
                        rōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rong2.mp3').play(); return false;`}
                        type='button'
                      >
                        róng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rong3.mp3').play(); return false;`}
                        type='button'
                      >
                        rǒng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ròng
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
                        rōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rou2.mp3').play(); return false;`}
                        type='button'
                      >
                        róu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        rǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rou4.mp3').play(); return false;`}
                        type='button'
                      >
                        ròu
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
                        rē
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ré
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/re3.mp3').play(); return false;`}
                        type='button'
                      >
                        rě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/re4.mp3').play(); return false;`}
                        type='button'
                      >
                        rè
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
                        rēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ren2.mp3').play(); return false;`}
                        type='button'
                      >
                        rén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ren3.mp3').play(); return false;`}
                        type='button'
                      >
                        rěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ren4.mp3').play(); return false;`}
                        type='button'
                      >
                        rèn
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
                        rēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/reng2.mp3').play(); return false;`}
                        type='button'
                      >
                        réng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        rěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/reng4.mp3').play(); return false;`}
                        type='button'
                      >
                        rèng
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
                        rī
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        rí
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        rǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ri4.mp3').play(); return false;`}
                        type='button'
                      >
                        rì
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
                        rū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ru2.mp3').play(); return false;`}
                        type='button'
                      >
                        rú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ru3.mp3').play(); return false;`}
                        type='button'
                      >
                        rǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ru4.mp3').play(); return false;`}
                        type='button'
                      >
                        rù
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
                        ruō
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ruó
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ruǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ruo4.mp3').play(); return false;`}
                        type='button'
                      >
                        ruò
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
                        ruī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rui2.mp3').play(); return false;`}
                        type='button'
                      >
                        ruí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rui3.mp3').play(); return false;`}
                        type='button'
                      >
                        ruǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/rui4.mp3').play(); return false;`}
                        type='button'
                      >
                        ruì
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
                        ruān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ruán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ruan3.mp3').play(); return false;`}
                        type='button'
                      >
                        ruǎn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ruàn
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
                        rūn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        rún
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        rǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/run4.mp3').play(); return false;`}
                        type='button'
                      >
                        rùn
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
                        jī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ji2.mp3').play(); return false;`}
                        type='button'
                      >
                        jí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ji3.mp3').play(); return false;`}
                        type='button'
                      >
                        jǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ji4.mp3').play(); return false;`}
                        type='button'
                      >
                        jì
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
                        jīa
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jia2.mp3').play(); return false;`}
                        type='button'
                      >
                        jía
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jia3.mp3').play(); return false;`}
                        type='button'
                      >
                        jǐa
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jia4.mp3').play(); return false;`}
                        type='button'
                      >
                        jìa
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
                        jiāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiao2.mp3').play(); return false;`}
                        type='button'
                      >
                        jiáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiao3.mp3').play(); return false;`}
                        type='button'
                      >
                        jiǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiao4.mp3').play(); return false;`}
                        type='button'
                      >
                        jiào
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
                        jiē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jie2.mp3').play(); return false;`}
                        type='button'
                      >
                        jié
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jie3.mp3').play(); return false;`}
                        type='button'
                      >
                        jiě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jie4.mp3').play(); return false;`}
                        type='button'
                      >
                        jiè
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
                        jiū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiu2.mp3').play(); return false;`}
                        type='button'
                      >
                        jiú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiu3.mp3').play(); return false;`}
                        type='button'
                      >
                        jiǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiu4.mp3').play(); return false;`}
                        type='button'
                      >
                        jiù
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
                        jiān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        jián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jian3.mp3').play(); return false;`}
                        type='button'
                      >
                        jiǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jian4.mp3').play(); return false;`}
                        type='button'
                      >
                        jiàn
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
                        jiāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        jiáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiang3.mp3').play(); return false;`}
                        type='button'
                      >
                        jiǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiang4.mp3').play(); return false;`}
                        type='button'
                      >
                        jiàng
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
                        jīn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        jín
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jin3.mp3').play(); return false;`}
                        type='button'
                      >
                        jǐn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jin4.mp3').play(); return false;`}
                        type='button'
                      >
                        jìn
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
                        jīng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        jíng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jing3.mp3').play(); return false;`}
                        type='button'
                      >
                        jǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jing4.mp3').play(); return false;`}
                        type='button'
                      >
                        jìng
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
                        jiōng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        jióng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jiong3.mp3').play(); return false;`}
                        type='button'
                      >
                        jiǒng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        jiòng
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
                        jū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ju2.mp3').play(); return false;`}
                        type='button'
                      >
                        jú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ju3.mp3').play(); return false;`}
                        type='button'
                      >
                        jǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ju4.mp3').play(); return false;`}
                        type='button'
                      >
                        jù
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
                        juē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jue2.mp3').play(); return false;`}
                        type='button'
                      >
                        jué
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jue3.mp3').play(); return false;`}
                        type='button'
                      >
                        juě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jue4.mp3').play(); return false;`}
                        type='button'
                      >
                        juè
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
                        juān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        juán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/juan3.mp3').play(); return false;`}
                        type='button'
                      >
                        juǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/juan4.mp3').play(); return false;`}
                        type='button'
                      >
                        juàn
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
                        jūn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        jún
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        jǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/jun4.mp3').play(); return false;`}
                        type='button'
                      >
                        jùn
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
                        qī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qi2.mp3').play(); return false;`}
                        type='button'
                      >
                        qí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qi3.mp3').play(); return false;`}
                        type='button'
                      >
                        qǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qi4.mp3').play(); return false;`}
                        type='button'
                      >
                        qì
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
                        qīa
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qia2.mp3').play(); return false;`}
                        type='button'
                      >
                        qía
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qia3.mp3').play(); return false;`}
                        type='button'
                      >
                        qǐa
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qia4.mp3').play(); return false;`}
                        type='button'
                      >
                        qìa
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
                        qiāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiao2.mp3').play(); return false;`}
                        type='button'
                      >
                        qiáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiao3.mp3').play(); return false;`}
                        type='button'
                      >
                        qiǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiao4.mp3').play(); return false;`}
                        type='button'
                      >
                        qiào
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
                        qiē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qie2.mp3').play(); return false;`}
                        type='button'
                      >
                        qié
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qie3.mp3').play(); return false;`}
                        type='button'
                      >
                        qiě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qie4.mp3').play(); return false;`}
                        type='button'
                      >
                        qiè
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
                        qiū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiu2.mp3').play(); return false;`}
                        type='button'
                      >
                        qiú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiu3.mp3').play(); return false;`}
                        type='button'
                      >
                        qiǔ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qiù
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
                        qiān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qian2.mp3').play(); return false;`}
                        type='button'
                      >
                        qián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qian3.mp3').play(); return false;`}
                        type='button'
                      >
                        qiǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qian4.mp3').play(); return false;`}
                        type='button'
                      >
                        qiàn
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
                        qiāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiang2.mp3').play(); return false;`}
                        type='button'
                      >
                        qiáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiang3.mp3').play(); return false;`}
                        type='button'
                      >
                        qiǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiang4.mp3').play(); return false;`}
                        type='button'
                      >
                        qiàng
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
                        qīn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qin2.mp3').play(); return false;`}
                        type='button'
                      >
                        qín
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qin3.mp3').play(); return false;`}
                        type='button'
                      >
                        qǐn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qin4.mp3').play(); return false;`}
                        type='button'
                      >
                        qìn
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
                        qīng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qing2.mp3').play(); return false;`}
                        type='button'
                      >
                        qíng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qing3.mp3').play(); return false;`}
                        type='button'
                      >
                        qǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qing4.mp3').play(); return false;`}
                        type='button'
                      >
                        qìng
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
                        qiōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qiong2.mp3').play(); return false;`}
                        type='button'
                      >
                        qióng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qiǒng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qiòng
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
                        qū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qu2.mp3').play(); return false;`}
                        type='button'
                      >
                        qú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qu3.mp3').play(); return false;`}
                        type='button'
                      >
                        qǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qu4.mp3').play(); return false;`}
                        type='button'
                      >
                        qù
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
                        quē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/que2.mp3').play(); return false;`}
                        type='button'
                      >
                        qué
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        quě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/que4.mp3').play(); return false;`}
                        type='button'
                      >
                        què
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
                        quān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/quan2.mp3').play(); return false;`}
                        type='button'
                      >
                        quán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/quan3.mp3').play(); return false;`}
                        type='button'
                      >
                        quǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/quan4.mp3').play(); return false;`}
                        type='button'
                      >
                        quàn
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
                        qūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/qun2.mp3').play(); return false;`}
                        type='button'
                      >
                        qún
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qǔn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        qùn
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
                        xī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xi2.mp3').play(); return false;`}
                        type='button'
                      >
                        xí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xi3.mp3').play(); return false;`}
                        type='button'
                      >
                        xǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xi4.mp3').play(); return false;`}
                        type='button'
                      >
                        xì
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
                        xīa
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xia2.mp3').play(); return false;`}
                        type='button'
                      >
                        xía
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        xǐa
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xia4.mp3').play(); return false;`}
                        type='button'
                      >
                        xìa
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
                        xiāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiao2.mp3').play(); return false;`}
                        type='button'
                      >
                        xiáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiao3.mp3').play(); return false;`}
                        type='button'
                      >
                        xiǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiao4.mp3').play(); return false;`}
                        type='button'
                      >
                        xiào
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
                        xiē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xie2.mp3').play(); return false;`}
                        type='button'
                      >
                        xié
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xie3.mp3').play(); return false;`}
                        type='button'
                      >
                        xiě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xie4.mp3').play(); return false;`}
                        type='button'
                      >
                        xiè
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
                        xiū
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        xiú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiu3.mp3').play(); return false;`}
                        type='button'
                      >
                        xiǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiu4.mp3').play(); return false;`}
                        type='button'
                      >
                        xiù
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
                        xiān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xian2.mp3').play(); return false;`}
                        type='button'
                      >
                        xián
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xian3.mp3').play(); return false;`}
                        type='button'
                      >
                        xiǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xian4.mp3').play(); return false;`}
                        type='button'
                      >
                        xiàn
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
                        xiāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiang2.mp3').play(); return false;`}
                        type='button'
                      >
                        xiáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiang3.mp3').play(); return false;`}
                        type='button'
                      >
                        xiǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiang4.mp3').play(); return false;`}
                        type='button'
                      >
                        xiàng
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
                        xīn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xin2.mp3').play(); return false;`}
                        type='button'
                      >
                        xín
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xin3.mp3').play(); return false;`}
                        type='button'
                      >
                        xǐn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xin4.mp3').play(); return false;`}
                        type='button'
                      >
                        xìn
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
                        xīng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xing2.mp3').play(); return false;`}
                        type='button'
                      >
                        xíng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xing3.mp3').play(); return false;`}
                        type='button'
                      >
                        xǐng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xing4.mp3').play(); return false;`}
                        type='button'
                      >
                        xìng
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
                        xiōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xiong2.mp3').play(); return false;`}
                        type='button'
                      >
                        xióng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        xiǒng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        xiòng
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
                        xū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xu2.mp3').play(); return false;`}
                        type='button'
                      >
                        xú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xu3.mp3').play(); return false;`}
                        type='button'
                      >
                        xǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xu4.mp3').play(); return false;`}
                        type='button'
                      >
                        xù
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
                        xuē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xue2.mp3').play(); return false;`}
                        type='button'
                      >
                        xué
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xue3.mp3').play(); return false;`}
                        type='button'
                      >
                        xuě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xue4.mp3').play(); return false;`}
                        type='button'
                      >
                        xuè
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
                        xuān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xuan2.mp3').play(); return false;`}
                        type='button'
                      >
                        xuán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        xuǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xuan4.mp3').play(); return false;`}
                        type='button'
                      >
                        xuàn
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
                        xūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xun2.mp3').play(); return false;`}
                        type='button'
                      >
                        xún
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        xǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/xun4.mp3').play(); return false;`}
                        type='button'
                      >
                        xùn
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
                        gā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ga2.mp3').play(); return false;`}
                        type='button'
                      >
                        gá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ga3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ga4.mp3').play(); return false;`}
                        type='button'
                      >
                        gà
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
                        gāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gai3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gai4.mp3').play(); return false;`}
                        type='button'
                      >
                        gài
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
                        gāo
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gáo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gao3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gao4.mp3').play(); return false;`}
                        type='button'
                      >
                        gào
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
                        gān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gan3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gan4.mp3').play(); return false;`}
                        type='button'
                      >
                        gàn
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
                        gāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gang3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gang4.mp3').play(); return false;`}
                        type='button'
                      >
                        gàng
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
                        gōng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        góng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gong3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gong4.mp3').play(); return false;`}
                        type='button'
                      >
                        gòng
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
                        gōu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        góu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gou3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gou4.mp3').play(); return false;`}
                        type='button'
                      >
                        gòu
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
                        gē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ge2.mp3').play(); return false;`}
                        type='button'
                      >
                        gé
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ge3.mp3').play(); return false;`}
                        type='button'
                      >
                        gě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ge4.mp3').play(); return false;`}
                        type='button'
                      >
                        gè
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
                        gēi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gei3.mp3').play(); return false;`}
                        type='button'
                      >
                        gěi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gèi
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
                        gēn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gen2.mp3').play(); return false;`}
                        type='button'
                      >
                        gén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gen3.mp3').play(); return false;`}
                        type='button'
                      >
                        gěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gen4.mp3').play(); return false;`}
                        type='button'
                      >
                        gèn
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
                        gēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/geng2.mp3').play(); return false;`}
                        type='button'
                      >
                        géng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/geng3.mp3').play(); return false;`}
                        type='button'
                      >
                        gěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/geng4.mp3').play(); return false;`}
                        type='button'
                      >
                        gèng
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
                        gū
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gu3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gu4.mp3').play(); return false;`}
                        type='button'
                      >
                        gù
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
                        guā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        guá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gua3.mp3').play(); return false;`}
                        type='button'
                      >
                        guǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gua4.mp3').play(); return false;`}
                        type='button'
                      >
                        guà
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
                        guō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guo2.mp3').play(); return false;`}
                        type='button'
                      >
                        guó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guo3.mp3').play(); return false;`}
                        type='button'
                      >
                        guǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guo4.mp3').play(); return false;`}
                        type='button'
                      >
                        guò
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
                        guī
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        guí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gui3.mp3').play(); return false;`}
                        type='button'
                      >
                        guǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gui4.mp3').play(); return false;`}
                        type='button'
                      >
                        guì
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
                        guāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        guái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guai3.mp3').play(); return false;`}
                        type='button'
                      >
                        guǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guai4.mp3').play(); return false;`}
                        type='button'
                      >
                        guài
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
                        guān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        guán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guan3.mp3').play(); return false;`}
                        type='button'
                      >
                        guǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guan4.mp3').play(); return false;`}
                        type='button'
                      >
                        guàn
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
                        gūn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        gún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gun3.mp3').play(); return false;`}
                        type='button'
                      >
                        gǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/gun4.mp3').play(); return false;`}
                        type='button'
                      >
                        gùn
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
                        guāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        guáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guang3.mp3').play(); return false;`}
                        type='button'
                      >
                        guǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/guang4.mp3').play(); return false;`}
                        type='button'
                      >
                        guàng
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
                        kā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        ká
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ka3.mp3').play(); return false;`}
                        type='button'
                      >
                        kǎ
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kà
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
                        kāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kai2.mp3').play(); return false;`}
                        type='button'
                      >
                        kái
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kai4.mp3').play(); return false;`}
                        type='button'
                      >
                        kài
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
                        kāo
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        káo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kao3.mp3').play(); return false;`}
                        type='button'
                      >
                        kǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kao4.mp3').play(); return false;`}
                        type='button'
                      >
                        kào
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
                        kān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kan3.mp3').play(); return false;`}
                        type='button'
                      >
                        kǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kan4.mp3').play(); return false;`}
                        type='button'
                      >
                        kàn
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
                        kāng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        káng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kang3.mp3').play(); return false;`}
                        type='button'
                      >
                        kǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kang4.mp3').play(); return false;`}
                        type='button'
                      >
                        kàng
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
                        kōng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kong3.mp3').play(); return false;`}
                        type='button'
                      >
                        kǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kong4.mp3').play(); return false;`}
                        type='button'
                      >
                        kòng
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
                        kōu
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kou3.mp3').play(); return false;`}
                        type='button'
                      >
                        kǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kou4.mp3').play(); return false;`}
                        type='button'
                      >
                        kòu
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
                        kē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ke2.mp3').play(); return false;`}
                        type='button'
                      >
                        ké
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ke3.mp3').play(); return false;`}
                        type='button'
                      >
                        kě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ke4.mp3').play(); return false;`}
                        type='button'
                      >
                        kè
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
                        kēn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ken3.mp3').play(); return false;`}
                        type='button'
                      >
                        kěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ken4.mp3').play(); return false;`}
                        type='button'
                      >
                        kèn
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
                        kēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/keng2.mp3').play(); return false;`}
                        type='button'
                      >
                        kéng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/keng3.mp3').play(); return false;`}
                        type='button'
                      >
                        kěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/keng4.mp3').play(); return false;`}
                        type='button'
                      >
                        kèng
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
                        kū
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ku3.mp3').play(); return false;`}
                        type='button'
                      >
                        kǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ku4.mp3').play(); return false;`}
                        type='button'
                      >
                        kù
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
                        kuā
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kuá
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kua3.mp3').play(); return false;`}
                        type='button'
                      >
                        kuǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kua4.mp3').play(); return false;`}
                        type='button'
                      >
                        kuà
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
                        kuō
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kuó
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kuǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuo4.mp3').play(); return false;`}
                        type='button'
                      >
                        kuò
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
                        kuī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kui2.mp3').play(); return false;`}
                        type='button'
                      >
                        kuí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kui3.mp3').play(); return false;`}
                        type='button'
                      >
                        kuǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kui4.mp3').play(); return false;`}
                        type='button'
                      >
                        kuì
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
                        kuāi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kuái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuai3.mp3').play(); return false;`}
                        type='button'
                      >
                        kuǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuai4.mp3').play(); return false;`}
                        type='button'
                      >
                        kuài
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
                        kuān
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kuán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuan3.mp3').play(); return false;`}
                        type='button'
                      >
                        kuǎn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kuàn
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
                        kūn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        kún
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kun3.mp3').play(); return false;`}
                        type='button'
                      >
                        kǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kun4.mp3').play(); return false;`}
                        type='button'
                      >
                        kùn
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
                        kuāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuang2.mp3').play(); return false;`}
                        type='button'
                      >
                        kuáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuang3.mp3').play(); return false;`}
                        type='button'
                      >
                        kuǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/kuang4.mp3').play(); return false;`}
                        type='button'
                      >
                        kuàng
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
                        hā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ha2.mp3').play(); return false;`}
                        type='button'
                      >
                        há
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ha3.mp3').play(); return false;`}
                        type='button'
                      >
                        hǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/ha4.mp3').play(); return false;`}
                        type='button'
                      >
                        hà
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
                        hāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hai2.mp3').play(); return false;`}
                        type='button'
                      >
                        hái
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hai3.mp3').play(); return false;`}
                        type='button'
                      >
                        hǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hai4.mp3').play(); return false;`}
                        type='button'
                      >
                        hài
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
                        hāo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hao2.mp3').play(); return false;`}
                        type='button'
                      >
                        háo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hao3.mp3').play(); return false;`}
                        type='button'
                      >
                        hǎo
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hao4.mp3').play(); return false;`}
                        type='button'
                      >
                        hào
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
                        hān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/han2.mp3').play(); return false;`}
                        type='button'
                      >
                        hán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/han3.mp3').play(); return false;`}
                        type='button'
                      >
                        hǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/han4.mp3').play(); return false;`}
                        type='button'
                      >
                        hàn
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
                        hāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hang2.mp3').play(); return false;`}
                        type='button'
                      >
                        háng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hang3.mp3').play(); return false;`}
                        type='button'
                      >
                        hǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hang4.mp3').play(); return false;`}
                        type='button'
                      >
                        hàng
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
                        hōng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hong2.mp3').play(); return false;`}
                        type='button'
                      >
                        hóng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hong3.mp3').play(); return false;`}
                        type='button'
                      >
                        hǒng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hong4.mp3').play(); return false;`}
                        type='button'
                      >
                        hòng
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
                        hōu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hou2.mp3').play(); return false;`}
                        type='button'
                      >
                        hóu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hou3.mp3').play(); return false;`}
                        type='button'
                      >
                        hǒu
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hou4.mp3').play(); return false;`}
                        type='button'
                      >
                        hòu
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
                        hē
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/he2.mp3').play(); return false;`}
                        type='button'
                      >
                        hé
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hě
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/he4.mp3').play(); return false;`}
                        type='button'
                      >
                        hè
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
                        hēi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hei2.mp3').play(); return false;`}
                        type='button'
                      >
                        héi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hěi
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hèi
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
                        hēn
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hén
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hen3.mp3').play(); return false;`}
                        type='button'
                      >
                        hěn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hen4.mp3').play(); return false;`}
                        type='button'
                      >
                        hèn
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
                        hēng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/heng2.mp3').play(); return false;`}
                        type='button'
                      >
                        héng
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hěng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/heng4.mp3').play(); return false;`}
                        type='button'
                      >
                        hèng
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
                        hū
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hu2.mp3').play(); return false;`}
                        type='button'
                      >
                        hú
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hu3.mp3').play(); return false;`}
                        type='button'
                      >
                        hǔ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hu4.mp3').play(); return false;`}
                        type='button'
                      >
                        hù
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
                        huā
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hua2.mp3').play(); return false;`}
                        type='button'
                      >
                        huá
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        huǎ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hua4.mp3').play(); return false;`}
                        type='button'
                      >
                        huà
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
                        huō
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huo2.mp3').play(); return false;`}
                        type='button'
                      >
                        huó
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huo3.mp3').play(); return false;`}
                        type='button'
                      >
                        huǒ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huo4.mp3').play(); return false;`}
                        type='button'
                      >
                        huò
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
                        huī
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hui2.mp3').play(); return false;`}
                        type='button'
                      >
                        huí
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hui3.mp3').play(); return false;`}
                        type='button'
                      >
                        huǐ
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hui4.mp3').play(); return false;`}
                        type='button'
                      >
                        huì
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
                        huāi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huai2.mp3').play(); return false;`}
                        type='button'
                      >
                        huái
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        huǎi
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huai4.mp3').play(); return false;`}
                        type='button'
                      >
                        huài
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
                        huān
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huan2.mp3').play(); return false;`}
                        type='button'
                      >
                        huán
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huan3.mp3').play(); return false;`}
                        type='button'
                      >
                        huǎn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huan4.mp3').play(); return false;`}
                        type='button'
                      >
                        huàn
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
                        hūn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hun2.mp3').play(); return false;`}
                        type='button'
                      >
                        hún
                      </button>
                    </li>
                    <li>
                      <button className='btn btn-danger disabled' type='button'>
                        hǔn
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/hun4.mp3').play(); return false;`}
                        type='button'
                      >
                        hùn
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
                        huāng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huang2.mp3').play(); return false;`}
                        type='button'
                      >
                        huáng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huang3.mp3').play(); return false;`}
                        type='button'
                      >
                        huǎng
                      </button>
                    </li>
                    <li>
                      <button
                        className='btn btn-outline-info'
                        data-pinyin={`new Audio('${myAudioURL}pinyin/huang4.mp3').play(); return false;`}
                        type='button'
                      >
                        huàng
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
}
