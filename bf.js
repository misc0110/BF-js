var BF = new function() {
  
    this.prog = null;
    this.ip = null;
    this.band = []
    this.band_ptr = 0;
    this.out = [];
    
    this.max_width_prog = 20;
    this.max_width_memory = 7;
    
    this.start = function(prog) {
        BF.prog = prog + " ";
        BF.ip = 0;
        BF.band_ptr = 0;
        BF.band = [ 0 ];
        BF.out = [];
        BF.displayBand();
        BF.displaySource();
        BF.output();
    };
    
    this.displayBand = function() {
        var band = document.getElementById('band');
        var html = "<table class='band'>";

        var lines = [];
        var linec = Math.ceil(BF.band.length / BF.max_width_memory);
        
        for(var l = 0; l < linec * 2; l++) {
          lines.push("<tr>");   
        }
        
        for(var i = 0; i < BF.band.length; i++) {
          idx = Math.floor(i / BF.max_width_memory) * 2;
          lines[idx] += "<th>" + (i == BF.band_ptr ? "&#x25BC;" : "") + "</th>";
          lines[idx + 1] += "<td>" + BF.band[i] + "</td>";
        }
                
        for(var l = 0; l < linec * 2; l++) {
            html += lines[l] + "</tr>";            
        }        
        
        html += "</table>";
        band.innerHTML = html;        
    };
    
    this.displaySource = function() {
        var src = document.getElementById('source');
        var html = "<table class='source'>";
        
        var lines = [];
        var linec = Math.ceil(BF.prog.length / BF.max_width_prog);
        
        for(var l = 0; l < linec * 2; l++) {
            lines.push("<tr>");            
        }        
        
        for(var i = 0; i < BF.prog.length; i++) {
          idx = Math.floor(i / BF.max_width_prog) * 2;
          lines[idx] += "<th>" + (i == BF.ip ? "&#x25BC;" : "") + "</th>";
          lines[idx + 1] += "<td>" + BF.syntaxHighlight(BF.prog[i]) + "</td>";
        }
        
        for(var l = 0; l < linec * 2; l++) {
            html += lines[l] + "</tr>";            
        }        
        
        html += "</table>";
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
    
    this.step = function() {
        switch(BF.prog[BF.ip]) {
            case '+':
                BF.band[BF.band_ptr]++;
                BF.ip++;
                break;
            case '-':
                BF.band[BF.band_ptr]--;
                BF.ip++;
                break;
            case '<':
                BF.band_ptr--;
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
                BF.band[BF.band_ptr] = prompt("Enter value:", 0);
                BF.ip++;
                break;
            case '[':
                if(BF.band[BF.band_ptr] == 0) {
                  // find matching ]
                  var level = 0;
                  while(!(level == -1 && BF.prog[BF.ip] == ']')) {
                    BF.ip++;
                    if(BF.prog[BF.ip] == ']') level--;
                    if(BF.prog[BF.ip] == '[') level++;
                  }
                }
                BF.ip++;
                break;
            case ']':
                // find matching [
                var level = 0;
                while(!(level == 1 && BF.prog[BF.ip + 1] == '[')) {
                  BF.ip--;   
                  if(BF.prog[BF.ip] == ']') level--;
                  if(BF.prog[BF.ip] == '[') level++;  
                }
                BF.ip++;
                break;
        }
        
        BF.displayBand();
        BF.displaySource();
    };
    
    this.run = function() {
        while(BF.ip < BF.prog.length - 1) BF.step();
    };
    
    this.output = function(c) {
        if(c !== undefined) BF.out.push(c);
        var outp = document.getElementById('out');
        var html = "<table class='output'>";
        var line1 = "<tr>";
        var line2 = "<tr>";
        for(var i = 0; i < BF.out.length; i++) {
          line1 += "<th>" + (BF.out[i] >= 32 && BF.out[i] <= 126 ? String.fromCharCode(BF.out[i]) : "<span class='chr-err'>?</span>") + "</th>";
          line2 += "<td>" + BF.out[i] + "</td>";
        }
        line1 += "</tr>";
        line2 += "</tr>";
        html += line1 + line2 + "</table>";
        outp.innerHTML = html;
    };
    
};
