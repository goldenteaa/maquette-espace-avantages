// Connexion SIMULÉE pour la démonstration du prototype.
// Aucune donnée n'est envoyée : tout reste dans le navigateur (localStorage).
(function () {
    var CLE = 'ea-demo';
    var DEMO = {
        email: 'demo@espace-avantages.fr',
        mdp: 'auditorium',
        prenom: 'Marie',
        nom: 'Dupont',
        numero: 'AB-204518',
        adresse: '12 rue de l’Exemple, 75016 Paris',
        abonnement: 'Abonnement Concerts 2026-2027 · 6 concerts'
    };
    function lire() { try { return JSON.parse(localStorage.getItem(CLE)) || {}; } catch (e) { return {}; } }
    function ecrire(d) { try { localStorage.setItem(CLE, JSON.stringify(d)); } catch (e) {} }
    function moisCourant() { return new Date().toISOString().slice(0, 7); }

    var EA = window.EA = {
        DEMO: DEMO,
        utilisateur: function () { return lire().connecte ? DEMO : null; },
        connecter: function (email, mdp) {
            if (String(email).trim().toLowerCase() === DEMO.email && mdp === DEMO.mdp) {
                var d = lire(); d.connecte = true; ecrire(d); return true;
            }
            return false;
        },
        deconnecter: function () { var d = lire(); d.connecte = false; ecrire(d); },
        reservations: function () { return lire().resas || []; },
        ajouterReservation: function (r) { var d = lire(); d.resas = d.resas || []; d.resas.unshift(r); ecrire(d); },
        reservationDuMois: function () {
            var m = moisCourant();
            return EA.reservations().filter(function (r) { return r.date.slice(0, 7) === m; })[0] || null;
        },
        reinitialiser: function () { var d = lire(); ecrire({ connecte: d.connecte }); },
        lienConnexion: function () {
            return 'connexion.html?retour=' + encodeURIComponent(location.pathname.split('/').pop() + location.search);
        }
    };

    // En-tête : « Se connecter » devient « Mon compte » une fois connecté
    function majEntete() {
        var u = EA.utilisateur();
        var liens = document.querySelectorAll('header a');
        for (var i = 0; i < liens.length; i++) {
            if (/Se connecter/.test(liens[i].textContent)) {
                var a = liens[i], span = a.querySelector('span');
                if (u) { a.href = 'mon-compte.html'; if (span) span.textContent = 'Mon compte'; a.setAttribute('aria-label', 'Mon compte, ' + u.prenom); }
                else { a.href = EA.lienConnexion(); a.setAttribute('aria-label', 'Se connecter'); }
            }
        }
        var off = document.querySelectorAll('[data-si-deconnecte]'), on = document.querySelectorAll('[data-si-connecte]');
        for (var j = 0; j < off.length; j++) off[j].classList.toggle('hidden', !!u);
        for (var k = 0; k < on.length; k++) on[k].classList.toggle('hidden', !u);
        var noms = document.querySelectorAll('[data-prenom]');
        for (var n = 0; n < noms.length; n++) noms[n].textContent = u ? u.prenom : '';
        var etat = document.querySelectorAll('[data-etat-mois]');
        var r = EA.reservationDuMois();
        for (var e = 0; e < etat.length; e++) etat[e].textContent = r
            ? 'Vous avez déjà profité de votre avantage ce mois-ci (« ' + r.titre + ' »).'
            : 'Votre avantage du mois est disponible : choisissez une offre ouverte à la réservation.';
    }
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', majEntete); else majEntete();
    EA.majEntete = majEntete;
})();
