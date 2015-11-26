var BF = new function() {
  
    this.prog = null;
    this.ip = null;
    this.band = []
    this.band_ptr = 0;
    this.out = [];
    this.brackets = {}
    
    this.max_width_prog = 20;
    this.max_width_memory = 7;
    
    this.start = function(prog) {
        BF.prog = prog.replace(/([^\.,<>\[\]\+\-])/g, "") + " ";
        BF.ip = 0;
        BF.band_ptr = 0;
        BF.band = [ 0 ];
        BF.out = [];
        if(!BF.parseBrackets()) {
            alert("Could not parse program!");
            BF.prog = null; 
            return;
        }
        BF.displayBand();
        BF.displaySource();
        BF.output();
    };
    
    this.formatTable = function(array, max_len, css_class, cb_head, cb_body) {
        var html = "<table class='" + css_class + "'>";

        var lines = [];
        var linec = Math.ceil(array.length / max_len);
        
        for(var l = 0; l < linec * 2; l++) {
          lines.push("<tr>");   
        }
        
        for(var i = 0; i < array.length; i++) {
          idx = Math.floor(i / max_len) * 2;
          lines[idx] += "<th>" + cb_head(i) + "</th>";
          lines[idx + 1] += "<td>" + cb_body(i) + "</td>";
        }
                
        for(var l = 0; l < linec * 2; l++) {
            html += lines[l] + "</tr>";            
        }        
        
        html += "</table>";
        return html;
    };
    
    this.displayBand = function() {
        var band = document.getElementById('band');
        var html = BF.formatTable(BF.band, BF.max_width_memory, "band", function(i) { 
            return i == BF.band_ptr ? "&#x25BC;" : "";
        }, function(i) { 
            return BF.band[i]; 
        });
        band.innerHTML = html;        
    };
    
    this.displaySource = function() {
        var src = document.getElementById('source');
        var html = BF.formatTable(BF.prog, BF.max_width_prog, "source", function(i) { 
            return i == BF.ip ? "&#x25BC;" : "";
        }, function(i) { 
            return BF.syntaxHighlight(BF.prog[i]); 
        });
        
        src.innerHTML = html;        
    };
    
    this.syntaxHighlight = function(c) {
       var cl = "";
       switch(c) {
           case '+':
           case '-':
               cl = 'bf-arith';
               break;
           case '<':
           case '>':
               cl = 'bf-band';
               break;
           case '.':
           case ',':
               cl = 'bf-io';
               break;
           case '[':
           case ']':
               cl = 'bf-loop';
               break;
       }
       return "<span class='" + cl + "'>" + c + "</span>";
    };
    
    this.parseBrackets = function() {
      BF.brackets = {};
      var br = {};
      var level = 0;
      for(var i = 0; i < BF.prog.length; i++) {
        if(BF.prog[i] == '[') {
            br[level] = i;
            level++;  
        }
        else if(BF.prog[i] == ']') {
           level--;
           if(level < 0) {
               return false;
           }
           BF.brackets[i] = br[level];
           BF.brackets[br[level]] = i;
        }
      }
      return true;
    };
    
    this.step = function() {
        if(BF.prog == null) {
          alert("You must load a program first");
          return;
        }
        switch(BF.prog[BF.ip]) {
            case '+':
                BF.band[BF.band_ptr] = (BF.band[BF.band_ptr] + 1) % 256;
                BF.ip++;
                break;
            case '-':
                BF.band[BF.band_ptr] = (BF.band[BF.band_ptr] + 255) % 256;
                BF.ip++;
                break;
            case '<':
                if(BF.band_ptr > 0) BF.band_ptr--;
                BF.ip++;
                break;
            case '>':
                BF.band_ptr++;
                if(BF.band_ptr >= BF.band.length) BF.band.push(0);
                BF.ip++;
                break;
            case '.':
                BF.output(BF.band[BF.band_ptr]);
                BF.ip++;
                break;
            case ',':
                BF.band[BF.band_ptr] = parseInt(prompt("Enter value:", 0));
                BF.ip++;
                break;
            case '[':
                if(BF.band[BF.band_ptr] == 0) {
                  BF.ip = BF.brackets[BF.ip];
                }
                BF.ip++;
                break;
            case ']':
                BF.ip = BF.brackets[BF.ip];
                break;
            default:
                if(BF.ip < BF.prog.length - 1) BF.ip++;
                break;
        }
        
        BF.displayBand();
        BF.displaySource();
    };
    
    this.run = function() {
        if(BF.prog == null) {
          alert("You must load a program first");
          return;
        }
        BF.stepAll();
    };
    
    this.stepAll = function() {
        if(BF.ip != BF.prog.length - 1) {
          BF.step();
          window.setTimeout(BF.stepAll, 10);
        }
    };
    
    this.output = function(c) {
        if(c !== undefined) BF.out.push(c);
        var outp = document.getElementById('out');
        var html = "<table class='output'>";
        var line1 = "<tr>";
        var line2 = "<tr>";
        for(var i = 0; i < BF.out.length; i++) {
          line1 += "<th>" + (BF.out[i] >= 32 && BF.out[i] <= 126 ? String.fromCharCode(BF.out[i]) : BF.out[i] == 10 ? "\\n" : "<span class='chr-err'>?</span>") + "</th>";
          line2 += "<td>" + BF.out[i] + "</td>";
        }
        line1 += "</tr>";
        line2 += "</tr>";
        html += line1 + line2 + "</table>";
        outp.innerHTML = html;
    };
    
};
