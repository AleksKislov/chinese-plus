import React, { useState, useEffect } from "react";
import { connect } from "react-redux";
import axios from "axios";
import { loadUser } from "../../actions/auth";

const SetAvatar = ({ user, loadUser }) => {
  useEffect(() => {
    getRandStr();
  }, []);

  const alltypes = {
    skin: [
      { eng: false, rus: "случайно" },
      { rus: "загорелый", eng: "tanned" },
      { rus: "желтый", eng: "yellow" },
      { rus: "бледный", eng: "pale" },
      { rus: "светлый", eng: "light" },
      { rus: "коричневый", eng: "brown" },
      { rus: "темно-коричневый", eng: "darkBrown" },
      { rus: "черный", eng: "black" }
    ],
    mouth: [
      { eng: false, rus: "случайно" },
      { eng: "concerned", rus: "озадаченный" },
      { eng: "default", rus: "обычный" },
      { eng: "disbelief", rus: "не могу поверить!" },
      { eng: "eating", rus: "кушаю" },
      { eng: "grimace", rus: "гримаса" },
      { eng: "sad", rus: "грустный" },
      { eng: "scream", rus: "кричу" },
      { eng: "serious", rus: "серьезный" },
      { eng: "smile", rus: "радостный" },
      { eng: "tongue", rus: "показать язык" },
      { eng: "twinkle", rus: "довольный" },
      { eng: "vomit", rus: "тошнит" }
    ],
    eyebrow: [
      { eng: false, rus: "случайно" },
      { eng: "angry", rus: "злой" },
      { eng: "default", rus: "обычные" },
      { eng: "flat", rus: "ровные" },
      { eng: "raised", rus: "приподнятые" },
      { eng: "sad", rus: "грустные" },
      { eng: "unibrow", rus: "монобровь" },
      { eng: "up", rus: "одна вверх" },
      { eng: "frown", rus: "домиком" }
    ],
    eyes: [
      { eng: false, rus: "случайно" },
      { eng: "close", rus: "закрытые" },
      { eng: "default", rus: "обычные" },
      { eng: "cry", rus: "со слезой" },
      { eng: "dizzy", rus: "крестиком" },
      { eng: "roll", rus: "закатить глаза" },
      { eng: "happy", rus: "счастливые" },
      { eng: "hearts", rus: "излучают любовь" },
      { eng: "side", rus: "смотрят в сторону" },
      { eng: "squint", rus: "прищурены" },
      { eng: "surprised", rus: "вытыращить от удивления" },
      { eng: "wink", rus: "подмигнуть" },
      { eng: "winkWacky", rus: "подмигнуть и вытаращить" }
    ],
    clothes: [
      { eng: false, rus: "случайно" },
      { eng: "blazer", rus: "пиджак" },
      { eng: "sweater", rus: "свитер" },
      { eng: "shirt", rus: "футболка" },
      { eng: "hoodie", rus: "худи" },
      { eng: "overall", rus: "комбинезон" }
    ],
    clothesColor: [
      { eng: false, rus: "случайно" },
      { rus: "синий", eng: "blue" },
      { rus: "серый", eng: "gray" },
      { rus: "серо-лиловый", eng: "heather" },
      { rus: "пастельный", eng: "pastel" },
      { rus: "розовый", eng: "pink" },
      { rus: "красный", eng: "red" },
      { rus: "черный", eng: "black" },
      { rus: "белый", eng: "white" }
    ],
    facialHair: [
      { eng: false, rus: "случайно" },
      { rus: "короткая борода", eng: "light" },
      { rus: "средняя борода", eng: "medium" },
      { rus: "роскошная борода", eng: "majestic" },
      { rus: "экстравагантные усики", eng: "fancy" },
      { rus: "магнум усищи", eng: "magnum" }
    ],
    facialHairColor: [
      { eng: false, rus: "случайно" },
      { rus: "каштановый", eng: "auburn" },
      { rus: "светлый", eng: "blonde" },
      { rus: "пастельный", eng: "pastel" },
      { rus: "платина", eng: "platinum" },
      { rus: "коричневый", eng: "brown" },
      { rus: "серый", eng: "gray" },
      { rus: "черный", eng: "black" },
      { rus: "рыжий", eng: "red" }
    ],
    accessories: [
      { eng: false, rus: "случайно" },
      { eng: "kurt", rus: "аля Курт Кобэйн" },
      { eng: "prescription01", rus: "очки 1" },
      { eng: "prescription02", rus: "очки 2" },
      { eng: "round", rus: "круглые" },
      { eng: "sunglasses", rus: "солнцезащитные" },
      { eng: "wayfarers", rus: "вайфареры" }
    ],
    accessoriesColor: [
      { eng: false, rus: "случайно" },
      { rus: "синий", eng: "blue" },
      { rus: "серый", eng: "gray" },
      { rus: "серо-лиловый", eng: "heather" },
      { rus: "пастельный", eng: "pastel" },
      { rus: "розовый", eng: "pink" },
      { rus: "красный", eng: "red" },
      { rus: "черный", eng: "black" },
      { rus: "белый", eng: "white" }
    ],
    top: [
      { eng: false, rus: "случайно" },
      { eng: "longHair", rus: "длинные волосы" },
      { eng: "shortHair", rus: "короткие волосы" },
      { eng: "eyepatch", rus: "повязка на глаз" },
      { eng: "hat", rus: "головной убор" },
      { eng: "hijab", rus: "хиджаб" },
      { eng: "turban", rus: "тюрбан" }
    ],
    hairColor: [
      { eng: false, rus: "случайно" },
      { rus: "каштановый", eng: "auburn" },
      { rus: "светлый", eng: "blonde" },
      { rus: "пастельный", eng: "pastel" },
      { rus: "платина", eng: "platinum" },
      { rus: "коричневый", eng: "brown" },
      { rus: "серый", eng: "gray" },
      { rus: "черный", eng: "black" },
      { rus: "рыжий", eng: "red" }
    ],
    hatColor: [
      { eng: false, rus: "случайно" },
      { rus: "синий", eng: "blue" },
      { rus: "серый", eng: "gray" },
      { rus: "серо-лиловый", eng: "heather" },
      { rus: "пастельный", eng: "pastel" },
      { rus: "розовый", eng: "pink" },
      { rus: "красный", eng: "red" },
      { rus: "черный", eng: "black" },
      { rus: "белый", eng: "white" }
    ],
    style: [
      { eng: false, rus: "нет" },
      { eng: "circle", rus: "в кружочке" }
    ],
    background: [
      { eng: false, rus: "нет" },
      { eng: "18bc9c", rus: "зеленый" },
      { eng: "3498db", rus: "синий" },
      { eng: "95a5a6", rus: "серый" },
      { eng: "f39c12", rus: "желтый" },
      { eng: "e74c3c", rus: "красный" },
      { eng: "2c3e50", rus: "антрацит" }
    ]
  };
  const initialState = {
    skin: alltypes.skin[0].eng,
    mouth: alltypes.mouth[0].eng,
    eyebrow: alltypes.eyebrow[0].eng,
    eyes: alltypes.eyes[0].eng,
    clothes: alltypes.clothes[0].eng,
    clothesColor: alltypes.clothesColor[0].eng,
    facialHair: alltypes.facialHair[0].eng,
    facialHairColor: alltypes.facialHairColor[0].eng,
    accessories: alltypes.accessories[0].eng,
    accessoriesColor: alltypes.accessoriesColor[0].eng,
    top: alltypes.top[0].eng,
    hairColor: alltypes.hairColor[0].eng,
    hatColor: alltypes.hatColor[0].eng,
    style: alltypes.style[0].eng,
    background: alltypes.background[0].eng
  };

  // const [user, setUser] = useState(user);

  const [str, setStr] = useState("example");
  const [filters, setFilters] = useState(initialState);

  const getRandStr = () => {
    const symbols = "abcdefghijklmnopqrstuvwxyz0123456789";
    const randLength = Math.ceil(Math.random() * 10);
    let str = "";

    for (let i = 0; i < randLength; i++) {
      str += symbols[Math.floor(symbols.length * Math.random())];
    }

    setStr(str);
  };

  const selectIt = e => {
    setFilters({
      ...filters,
      [e.target.id]:
        alltypes[e.target.id][parseInt(e.target.options[e.target.options.selectedIndex].value)].eng
    });
  };

  const clearFilters = () => {
    setFilters(initialState);
    Object.keys(initialState).forEach(x => {
      document.getElementById(x).value = "0";
    });
  };

  const setAvatar = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json"
      }
    };

    const avatar = document.getElementById("avatarImg").src.replace("https:", "");

    const body = JSON.stringify({ avatar });

    try {
      const { data } = await axios.post("/api/users/set_my_avatar", body, config);
      console.log(data);
    } catch (err) {
      console.error(err);
    }
    loadUser();
    // setUser({ ...user, avatar });
  };

  return (
    <div className='row'>
      <div className='col-sm-2'>
        {user && <img src={`https://${user.avatar}`} alt='avatar' style={imgStyle} />}

        <div className='btn btn-sm btn-outline-primary mt-2 btn-block' onClick={getRandStr}>
          Рандомизировать
        </div>
        <div className='btn btn-sm btn-outline-primary mt-2 btn-block' onClick={clearFilters}>
          Сброс фильтров
        </div>
        <div className='btn btn-sm btn-outline-primary mt-2 btn-block' onClick={setAvatar}>
          Хочу такой аватар
        </div>
        <p>
          Некоторые цвета и атрибуты могут быть выбраны только случайным образом, не все можно
          задать фильтрами
        </p>
      </div>
      <div className='col-sm-4'>
        <img
          id='avatarImg'
          style={{ border: "solid 1px #e0e0de" }}
          src={`https://avatars.dicebear.com/api/avataaars/${str}.svg?${
            filters.skin ? "skin[]=" + filters.skin : ""
          }${filters.mouth ? "&mouth[]=" + filters.mouth : ""}${
            filters.eyebrow ? "&eyebrow[]=" + filters.eyebrow : ""
          }${filters.eyes ? "&eyes[]=" + filters.eyes : ""}${
            filters.clothes ? "&clothes[]=" + filters.clothes : ""
          }${filters.clothesColor ? "&clothesColor[]=" + filters.clothesColor : ""}${
            filters.facialHair ? "&facialHairChance=100&facialHair[]=" + filters.facialHair : ""
          }${filters.facialHairColor ? "&facialHairColor[]=" + filters.facialHairColor : ""}${
            filters.accessories ? "&accessoriesChance=100&accessories[]=" + filters.accessories : ""
          }${filters.accessoriesColor ? "&accessoriesColor[]=" + filters.accessoriesColor : ""}${
            filters.top ? "&topChance=100&top[]=" + filters.top : ""
          }${filters.hatColor ? "&hatColor[]=" + filters.hatColor : ""}${
            filters.hairColor ? "&hairColor[]=" + filters.hairColor : ""
          }${filters.style ? "&style=" + filters.style : ""}${
            filters.background ? "&background=%23" + filters.background : ""
          }
          `}
          alt='pic'
        />
      </div>
      <div className='col-sm-3'>
        <div className='form-group'>
          <label htmlFor='style'>В кружке</label>
          <select className='form-control' id='style' onChange={e => selectIt(e)}>
            {alltypes.style.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='background'>Цвет фона</label>
          <select className='form-control' id='background' onChange={e => selectIt(e)}>
            {alltypes.background.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='skin'>Цвет кожи</label>
          <select className='form-control' id='skin' onChange={e => selectIt(e)}>
            {alltypes.skin.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='top'>На голове</label>
          <select className='form-control' id='top' onChange={e => selectIt(e)}>
            {alltypes.top.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='hairColor'>Цвет волос</label>
          <select className='form-control' id='hairColor' onChange={e => selectIt(e)}>
            {alltypes.hairColor.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='hatColor'>Цвет головного убора</label>
          <select className='form-control' id='hatColor' onChange={e => selectIt(e)}>
            {alltypes.hatColor.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='eyebrow'>Брови</label>
          <select className='form-control' id='eyebrow' onChange={e => selectIt(e)}>
            {alltypes.eyebrow.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
      </div>

      <div className='col-sm-3'>
        <div className='form-group'>
          <label htmlFor='eyes'>Глаза</label>
          <select className='form-control' id='eyes' onChange={e => selectIt(e)}>
            {alltypes.eyes.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='accessories'>Очки</label>
          <select className='form-control' id='accessories' onChange={e => selectIt(e)}>
            {alltypes.accessories.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='accessoriesColor'>Цвет очков</label>
          <select className='form-control' id='accessoriesColor' onChange={e => selectIt(e)}>
            {alltypes.accessoriesColor.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='mouth'>Рот</label>
          <select className='form-control' id='mouth' onChange={e => selectIt(e)}>
            {alltypes.mouth.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='facialHair'>Усы / борода</label>
          <select className='form-control' id='facialHair' onChange={e => selectIt(e)}>
            {alltypes.facialHair.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='facialHairColor'>Цвет усов / бороды</label>
          <select className='form-control' id='facialHairColor' onChange={e => selectIt(e)}>
            {alltypes.facialHairColor.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='clothes'>Одежда</label>
          <select className='form-control' id='clothes' onChange={e => selectIt(e)}>
            {alltypes.clothes.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
        <div className='form-group'>
          <label htmlFor='clothesColor'>Цвет одежды</label>
          <select className='form-control' id='clothesColor' onChange={e => selectIt(e)}>
            {alltypes.clothesColor.map((type, ind) => {
              if (ind === 0) {
                return (
                  <option defaultValue='0' value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              } else {
                return (
                  <option value={ind} key={ind}>
                    {type.rus}
                  </option>
                );
              }
            })}
          </select>
        </div>
      </div>
    </div>
  );
};

const imgStyle = {
  width: "60px",
  borderRadius: "8px"
};

const mapStateToProps = state => ({
  user: state.auth.user
});

export default connect(mapStateToProps, { loadUser })(SetAvatar);
