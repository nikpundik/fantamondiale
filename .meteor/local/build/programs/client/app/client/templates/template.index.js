(function(){
UI.body.contentParts.push(UI.Component.extend({render: (function() {
  var self = this;
  return HTML.DIV({
    "class": "container main"
  }, "\n    ", Spacebars.include(self.lookupTemplate("header")), "\n    ", Spacebars.include(self.lookupTemplate("time")), "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "col-sm-9"
  }, Spacebars.include(self.lookupTemplate("rounds"))), "\n      ", HTML.DIV({
    "class": "col-sm-3"
  }, "\n        ", Spacebars.include(self.lookupTemplate("table")), "\n        ", Spacebars.include(self.lookupTemplate("chat")), "\n      "), "\n    "), HTML.Raw("\n    <hr>\n    "), Spacebars.include(self.lookupTemplate("rules")), "\n  ");
})}));
Meteor.startup(function () { if (! UI.body.INSTANTIATED) { UI.body.INSTANTIATED = true; UI.DomRange.insert(UI.render(UI.body).dom, document.body); } });

Template.__define__("header", (function() {
  var self = this;
  var template = this;
  return HTML.HEADER("\n    ", HTML.DIV({
    id: "login"
  }, Spacebars.TemplateWith(function() {
    return {
      align: Spacebars.call("left")
    };
  }, UI.block(function() {
    var self = this;
    return Spacebars.include(self.lookupTemplate("loginButtons"));
  }))), HTML.Raw("\n    <h1>FantaEURE - World Cup 2014 Brazil</h1>\n  "));
}));

Template.__define__("time", (function() {
  var self = this;
  var template = this;
  return HTML.P(function() {
    return Spacebars.mustache(self.lookup("time"));
  });
}));

Template.__define__("rounds", (function() {
  var self = this;
  var template = this;
  return HTML.UL({
    "class": "rounds"
  }, "\n	", UI.Each(function() {
    return Spacebars.call(self.lookup("rounds"));
  }, UI.block(function() {
    var self = this;
    return [ "\n      ", Spacebars.include(self.lookupTemplate("round")), "\n    " ];
  })), "\n    ");
}));

Template.__define__("round", (function() {
  var self = this;
  var template = this;
  return HTML.LI("\n    ", HTML.H2(function() {
    return Spacebars.mustache(self.lookup("end_at"));
  }, " - ", function() {
    return Spacebars.mustache(self.lookup("title"));
  }), "\n		", HTML.UL("\n		  ", UI.Each(function() {
    return Spacebars.call(self.lookup("games"));
  }, UI.block(function() {
    var self = this;
    return [ "\n      		", Spacebars.include(self.lookupTemplate("game")), "\n    	" ];
  })), "\n    "), "\n	");
}));

Template.__define__("game", (function() {
  var self = this;
  var template = this;
  return HTML.LI("\n    ", UI.If(function() {
    return Spacebars.call(self.lookup("isAdmin"));
  }, UI.block(function() {
    var self = this;
    return "\n    admin\n    ";
  })), "\n    ", HTML.H3(function() {
    return Spacebars.mustache(self.lookup("team1_title"));
  }, " ", HTML.SPAN({
    "class": "team-score"
  }, function() {
    return Spacebars.mustache(self.lookup("score1"));
  }), " ", HTML.SPAN({
    "class": "team-score"
  }, function() {
    return Spacebars.mustache(self.lookup("score2"));
  }), " ", function() {
    return Spacebars.mustache(self.lookup("team2_title"));
  }), "\n    ", HTML.FORM({
    round: function() {
      return Spacebars.mustache(Spacebars.dot(self.lookup(".."), "_id"));
    },
    game: function() {
      return Spacebars.mustache(self.lookup("_id"));
    }
  }, HTML.Raw('\n      <input class="team-1" type="number" min="0" max="20"> \n      <input class="team-2" type="number" min="0" max="20"> \n      <button bonus="false">BET</button>\n      <button bonus="true">BONUS</button>\n    ')), "\n    ", HTML.UL({
    "class": "bets"
  }, "\n      ", UI.Each(function() {
    return Spacebars.dataMustache(self.lookup("bets"), self.lookup("_id"));
  }, UI.block(function() {
    var self = this;
    return [ "\n        ", Spacebars.include(self.lookupTemplate("bet")), "\n      " ];
  })), "\n    "), HTML.Raw('\n    <div class="clearfix"></div>\n	'));
}));

Template.__define__("bet", (function() {
  var self = this;
  var template = this;
  return HTML.LI("\n  ", HTML.B(function() {
    return Spacebars.mustache(self.lookup("username"));
  }), " ", function() {
    return Spacebars.mustache(self.lookup("team1"));
  }, " ", function() {
    return Spacebars.mustache(self.lookup("team2"));
  }, " \n  ", UI.If(function() {
    return Spacebars.call(self.lookup("bonus"));
  }, UI.block(function() {
    var self = this;
    return [ "\n    ", HTML.P("BONUS"), "\n  " ];
  })), "\n  ");
}));

Template.__define__("table", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "table-div"
  }, HTML.Raw("\n    <h2>Classifica</h2>\n    "), HTML.UL({
    "class": "users-table"
  }, "\n      ", UI.Each(function() {
    return Spacebars.call(self.lookup("users"));
  }, UI.block(function() {
    var self = this;
    return [ "\n      ", HTML.LI(function() {
      return Spacebars.mustache(self.lookup("points"));
    }, " - ", function() {
      return Spacebars.mustache(self.lookup("username"));
    }), "\n      " ];
  })), "\n    "), "\n  ");
}));

Template.__define__("chat", (function() {
  var self = this;
  var template = this;
  return HTML.DIV(HTML.Raw("\n    <h2>Chat</h2>\n    "), HTML.DIV({
    "class": "messages"
  }, "\n      ", UI.Each(function() {
    return Spacebars.call(self.lookup("messages"));
  }, UI.block(function() {
    var self = this;
    return [ "\n        ", HTML.SMALL(function() {
      return Spacebars.mustache(self.lookup("time"));
    }), "\n        ", HTML.P(HTML.B(function() {
      return Spacebars.mustache(self.lookup("username"));
    }), " ", function() {
      return Spacebars.mustache(self.lookup("message"));
    }), " \n      " ];
  })), "\n    "), HTML.Raw('\n    <form action="">\n      <input type="text">\n      <button>SEND</button>\n    </form>\n  '));
}));

Template.__define__("rules", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<p>Le regole sono le stesse di 2 anni fa, ossia l\'obiettivo è quello di indovinare i risultati esatti delle partite in programma dal 12 giugno al 13 luglio.</p>\n  <p>Quota di iscrizione 5 euro. Il totale verrà poi suddiviso come segue:</p>\n\n  <ul>\n    <li>1 premio - 50% del totale</li>\n    <li>2 premio - 35% del totale</li>\n    <li>3 premio - 15% del totale</li>\n  </ul>\n\n  <h2>REGOLAMENTO:</h2>\n\n  <p>Il meccanismo del gioco è molto semplice. Ogni mattina verrà mandata una mail con le partite del giorno a cui bisognerà rispondere con il risultato pronosticato da voi entro e non oltre le ore 18.00 del giorno stesso.</p>\n\n  <p>Attribuzione punteggio:</p>\n\n\n  <ul>\n    <li>Se il risultato viene indovinato, verranno assegnati 3 punti ai vincitori.</li>\n    <li>Se viene indovinato il "segno" (vittoria, pareggio o sconfitta) ma non il risultato esatto, verrà assegnato 1 punto</li>\n    <li>Se non si indovina nè risultato nè "segno": 0 punti</li>\n    <li>Ogni fantagiocatore potrà avvelersi di 1 BONUS da giocare su una partita a piacere nell\'arco del torneo. Questo bonus fa sì che il punteggio di quella partita verrà raddoppiato</li>\n    <li>Ad inizio torneo (entro il 12 giungo alle 18.00) il fantagiocatore deve pronosticare anche la squadra vincitrice del Mondiale 2014. a chi indovinerà verranno dati 10 Punti.</li>\n  </ul>\n\n\n  <p>In caso di mancato pronostico verrà assegnato al fantagiocatore il risultato di default (0 - 0)</p>\n\n  <p>Ovviamente chi avrà più punti vince.<br>\n  In caso di parità di punteggio si conterà il numero di risultati esatti indovinati.<br>\n  In caso di ulteriore parità gli eventuali premi spettanti verrano uniti e divisi equamente.</p>');
}));

})();
