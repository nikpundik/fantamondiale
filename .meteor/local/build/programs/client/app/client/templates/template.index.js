(function(){
UI.body.contentParts.push(UI.Component.extend({render: (function() {
  var self = this;
  return [ HTML.DIV({
    "class": "header"
  }, "\n    ", HTML.DIV({
    "class": "container"
  }, Spacebars.include(self.lookupTemplate("header"))), "\n	"), "\n	", HTML.DIV({
    "class": "headerwinner"
  }, "\n    ", HTML.DIV({
    "class": "container"
  }, Spacebars.include(self.lookupTemplate("winner"))), "\n	"), "\n	", HTML.DIV({
    "class": "container main"
  }, "\n	", Spacebars.include(self.lookupTemplate("time")), "\n    ", Spacebars.include(self.lookupTemplate("admin")), "\n    ", HTML.DIV({
    "class": "row"
  }, "\n      ", HTML.DIV({
    "class": "col-sm-8"
  }, Spacebars.include(self.lookupTemplate("rounds"))), "\n      ", HTML.DIV({
    "class": "col-sm-4"
  }, "\n        ", Spacebars.include(self.lookupTemplate("table")), "\n        ", Spacebars.include(self.lookupTemplate("chat")), "\n      "), "\n    "), "\n    ", Spacebars.include(self.lookupTemplate("rules")), "\n  "), "\n   ", Spacebars.include(self.lookupTemplate("footer")) ];
})}));
Meteor.startup(function () { if (! UI.body.INSTANTIATED) { UI.body.INSTANTIATED = true; UI.DomRange.insert(UI.render(UI.body).dom, document.body); } });

Template.__define__("header", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "page-header"
  }, "\n  ", HTML.HEADER("\n    ", HTML.DIV({
    "class": "btn btn-info",
    id: "login"
  }, Spacebars.TemplateWith(function() {
    return {
      align: Spacebars.call("left")
    };
  }, UI.block(function() {
    var self = this;
    return Spacebars.include(self.lookupTemplate("loginButtons"));
  }))), HTML.Raw("\n    <h1>FantaEURE 2014</h1>\n  ")), "\n  ");
}));

Template.__define__("footer", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<footer>\n<div class="container"><p>Credits: Nik, Dave</p></div>\n</footer>');
}));

Template.__define__("admin", (function() {
  var self = this;
  var template = this;
  return UI.If(function() {
    return Spacebars.call(self.lookup("isAdmin"));
  }, UI.block(function() {
    var self = this;
    return [ "\n    ", HTML.BUTTON({
      "class": "update btn btn-danger"
    }, "AGGIORNA"), "\n  " ];
  }));
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
  return UI.If(function() {
    return Spacebars.dataMustache(self.lookup("isRoundStarted"), self.lookup("_id"));
  }, UI.block(function() {
    var self = this;
    return [ "\n    ", HTML.LI({
      "class": "days round-closed"
    }, " \n      ", HTML.H2("\n        ", function() {
      return Spacebars.mustache(self.lookup("end_at"));
    }, " - ", function() {
      return Spacebars.mustache(self.lookup("title"));
    }, " \n        ", HTML.SMALL("SCOMMESSE CHIUSE"), "\n      "), "\n      ", HTML.UL("\n        ", UI.Each(function() {
      return Spacebars.call(self.lookup("games"));
    }, UI.block(function() {
      var self = this;
      return [ "\n            ", Spacebars.include(self.lookupTemplate("game")), "\n        " ];
    })), "\n      "), "\n    "), "\n  " ];
  }), UI.block(function() {
    var self = this;
    return [ "\n    ", HTML.LI({
      "class": "days"
    }, "\n      ", HTML.H2("\n        ", function() {
      return Spacebars.mustache(self.lookup("end_at"));
    }, " - ", function() {
      return Spacebars.mustache(self.lookup("title"));
    }, "\n      "), "\n      ", HTML.UL("\n        ", UI.Each(function() {
      return Spacebars.call(self.lookup("games"));
    }, UI.block(function() {
      var self = this;
      return [ "\n            ", Spacebars.include(self.lookupTemplate("game")), "\n        " ];
    })), "\n      "), "\n    "), "\n  " ];
  }));
}));

Template.__define__("game", (function() {
  var self = this;
  var template = this;
  return HTML.LI("\n    ", UI.If(function() {
    return Spacebars.call(self.lookup("isAdmin"));
  }, UI.block(function() {
    var self = this;
    return [ "\n    ", HTML.FORM({
      style: "margin-top:40px;",
      round: function() {
        return Spacebars.mustache(Spacebars.dot(self.lookup(".."), "_id"));
      },
      game: function() {
        return Spacebars.mustache(self.lookup("_id"));
      },
      "class": "result-form"
    }, "\n      ", HTML.INPUT({
      type: "text",
      "class": "team-1-result form-control"
    }), "\n      ", HTML.INPUT({
      type: "text",
      "class": "team-2-result form-control"
    }), "\n      ", HTML.BUTTON({
      "class": "btn btn-danger"
    }, "RISULTATO"), "\n    "), "\n    " ];
  })), "\n    ", HTML.H3(function() {
    return Spacebars.mustache(self.lookup("team1_title"));
  }, " ", HTML.SPAN({
    "class": "team-score"
  }, function() {
    return Spacebars.mustache(self.lookup("score1"));
  }), " - ", HTML.SPAN({
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
    },
    "class": "bet-form"
  }, HTML.Raw('\n      <input class="team-1 form-control" placeholder="0" type="number" min="0" max="20">\n      <input class="team-2 form-control" placeholder="0" type="number" min="0" max="20"> \n      <button class="btn btn-primary" bonus="false">BET</button>\n      <button class="btn btn-warning" bonus="true">BONUS</button>\n    ')), "\n    ", HTML.UL({
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
  return HTML.LI({
    "class": [ "bet-default-", function() {
      return Spacebars.mustache(self.lookup("defaultBet"));
    } ]
  }, "\n    ", HTML.B(function() {
    return Spacebars.mustache(self.lookup("username"));
  }), "\n    ", UI.If(function() {
    return Spacebars.dataMustache(self.lookup("shown"), self.lookup("team1"), self.lookup("team2"));
  }, UI.block(function() {
    var self = this;
    return [ "\n    ", function() {
      return Spacebars.mustache(self.lookup("team1"));
    }, " - ", function() {
      return Spacebars.mustache(self.lookup("team2"));
    }, "\n    " ];
  })), "\n    ", UI.If(function() {
    return Spacebars.call(self.lookup("bonus"));
  }, UI.block(function() {
    var self = this;
    return [ "\n      ", HTML.SPAN({
      style: "color:#F9C000"
    }, HTML.B("BONUS")), "\n    " ];
  })), "\n  ");
}));

Template.__define__("table", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "table-div"
  }, HTML.Raw("\n    <h2>Classifica</h2>\n	 "), HTML.TABLE({
    "class": "users-table table table-condensed"
  }, HTML.Raw('\n	 <thead><tr><th>Username</th><th style="text-align:center">Punti</th><th>Winner</th></tr></thead>\n      '), UI.Each(function() {
    return Spacebars.call(self.lookup("users"));
  }, UI.block(function() {
    var self = this;
    return [ "\n      ", HTML.TR(HTML.TD({
      style: "padding-left:5px;"
    }, function() {
      return Spacebars.mustache(self.lookup("username"));
    }), HTML.TD({
      style: "text-align:center"
    }, HTML.B(function() {
      return Spacebars.mustache(self.lookup("points"));
    })), HTML.TD(function() {
      return Spacebars.mustache(self.lookup("winner_name"));
    })), "\n      " ];
  })), "\n	"), "\n	\n  ");
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
    return [ "\n        ", HTML.P(HTML.B(function() {
      return Spacebars.mustache(self.lookup("username"));
    }, ":"), " ", function() {
      return Spacebars.mustache(self.lookup("message"));
    }), " \n      " ];
  })), "\n    "), HTML.Raw('\n    <form action="">\n      <input class="form-control" type="text">\n      <button class="btn bt-default">INVIA</button>\n    </form>\n  '));
}));

Template.__define__("winner", (function() {
  var self = this;
  var template = this;
  return HTML.DIV({
    "class": "winner"
  }, HTML.Raw("\n  <h2>Vincitore</h2>\n  "), HTML.H3(function() {
    return Spacebars.mustache(Spacebars.dot(self.lookup("currentUser"), "winner_name"));
  }), "\n  \n  ");
}));

Template.__define__("rules", (function() {
  var self = this;
  var template = this;
  return HTML.Raw('<h2>PREMI:</h2>\n\n  <p>Le regole sono le stesse di 2 anni fa, ossia l\'obiettivo è quello di indovinare i risultati esatti delle partite in programma dal 12 giugno al 13 luglio.</p>\n  <p>Quota di iscrizione 5 euro. Il totale verrà poi suddiviso come segue:</p>\n\n  <ul>\n    <li>1 premio - 50% del totale</li>\n    <li>2 premio - 35% del totale</li>\n    <li>3 premio - 15% del totale</li>\n  </ul>\n\n  <h2>REGOLAMENTO:</h2>\n\n  <p>Il meccanismo del gioco è molto semplice. Ogni mattina verrà mandata una mail con le partite del giorno a cui bisognerà rispondere con il risultato pronosticato da voi entro e non oltre le ore 18.00 del giorno stesso.</p>\n\n  <p>Attribuzione punteggio:</p>\n\n\n  <ul>\n    <li>Se il risultato viene indovinato, verranno assegnati 3 punti ai vincitori.</li>\n    <li>Se viene indovinato il "segno" (vittoria, pareggio o sconfitta) ma non il risultato esatto, verrà assegnato 1 punto</li>\n    <li>Se non si indovina nè risultato nè "segno": 0 punti</li>\n    <li>Ogni fantagiocatore potrà avvelersi di 1 BONUS da giocare su una partita a piacere nell\'arco del torneo. Questo bonus fa sì che il punteggio di quella partita verrà raddoppiato</li>\n    <li>Ad inizio torneo (entro il 12 giungo alle 18.00) il fantagiocatore deve pronosticare anche la squadra vincitrice del Mondiale 2014. a chi indovinerà verranno dati 10 Punti.</li>\n  </ul>\n\n\n  <p>In caso di mancato pronostico verrà assegnato al fantagiocatore il risultato di default (0 - 0)</p>\n\n  <p>Ovviamente chi avrà più punti vince.<br>\n  In caso di parità di punteggio si conterà il numero di risultati esatti indovinati.<br>\n  In caso di ulteriore parità gli eventuali premi spettanti verrano uniti e divisi equamente.</p>');
}));

})();
