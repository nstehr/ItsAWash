(function(g, $) {
    $(function() {
        function Squirrel() {
            var facts = [
                "It is estimated that washing hands with soap and water could reduce diarrheal disease-associated deaths by up to 50%.",
                "Researchers in London estimate that if everyone routinely washed their hands, a million deaths a year could be prevented.",
                "A large percentage of foodborne disease outbreaks are spread by contaminated hands. Appropriate hand washing practices can reduce the risk of foodborne illness and other infections.",
                "Handwashing can reduce the risk of respiratory infections by 16%.",
                "The use of an alcohol gel hand sanitizer in the classroom provided an overall reduction in absenteeism due to infection by 19.8% among 16 elementary schools and 6,000 students.",
                "In Canada, healthcare associated infections (HCAI's) affect more than 220,000 people every year and kill 8,000 – 12,000.",
                "Hand hygiene, a very simple action, remains the primary means to reduce HCAI's and the spread of antimicrobial resistant organisms.",
                "HCAI's lead to long-term disability, preventable deaths, and additional financial burden on the healthcare system.",
                "Compliance by healthcare workers with optimal hand hygiene is considered to be less than 40%.",
                "Global research indicates that improvements in hand hygiene activities could potentially reduce HCAI rates by up to 50%!",
                "A study in Geneva, Switzerland found that the introduction of alcohol based hand rub increased hand hygiene compliance from 48% to 66% over 5 years, during which time HCAI rates fell by about 40%.",
                "The World Health Organization (WHO) recommends using an alcohol-based hand rub for routine antisepsis in most clinical situations where hands are not visibly soiled.",
                "Proper hand hygiene, when demonstrated by leaders, has been shown to positively influence the compliance of others by up to 70%."
            ];
            var factsLength = facts.length;
            
            var text = {
                hello: "Hello",
                prompt: "Don't forget to wash your hands.",
                wet: "Put your hands under the faucet to make them wet.",
                soap: "Now apply some soap.",
                lather: "Lather your hands by rubbing them together with the soap. Be sure to lather the backs of your hands, between your fingers, and under your nails.",
                scrub: 'Scrub your hands for at least 20 seconds.',
                rinse: "Now rinse your hands.",
                dry: "Dry your hands thoroughly and you're done!",
                underfaucet: "Please put your hands under the faucet",
                thank: "Thank you for washing your hands!"
            };

            var $s = $('#squirrel');
            var $b = $('#bubble');
            var $t = $b.find('.text');

            function setClass(cls) {
                $s.removeClass().addClass(cls);
                $b.removeClass().addClass(cls);
            }

            function setText(txt) {
                $t.text(txt);
            }

            var states = {
                idle: function() {
                    setClass('idle');
                    setText(facts[Math.floor(Math.random()*factsLength)]);
                },

                greet: function() {
                    setClass('greet');
                    setText(text.hello);
                },

                attention: function() {
                    setClass('attention');
                    setText(text.prompt);
                },

                wet: function() {
                    setClass('wet');
                    setText(text.wet);
                },

                soap: function() {
                    setClass('soap');
                    setText(text.soap);
                },
                
                scrub: function() {
                    setClass('scrub');
                    setText(text.scrub);
                },

                lather: function() {
                    setClass('lather');
                    setText(text.lather);
                },

                rinse: function() {
                    setClass('rinse');
                    setText(text.rinse);
                },

                dry: function() {
                    setClass('dry');
                    setText(text.dry);
                },

                pause: function() {
                }
            };
            
            states.idle();
            return states;
        }

        g.squirrel = new Squirrel();
    });
}(window, jQuery));