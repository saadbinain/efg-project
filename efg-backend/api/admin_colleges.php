<?php
// api/admin_colleges.php

function handleAdminColleges($db, $collegeId) {
    $method = $_SERVER['REQUEST_METHOD'];

    // List all colleges (or get single)
    if ($method === 'GET') {
        if ($collegeId) {
            $stmt = $db->prepare("SELECT * FROM colleges WHERE id = :id");
            $stmt->execute(['id' => $collegeId]);
            $college = $stmt->fetch();
            if (!$college) {
                http_response_code(404);
                echo json_encode(['error' => 'College not found']);
                return;
            }
            // Decode JSON fields for convenience
            $college['branches'] = json_decode($college['branches']);
            $college['locations'] = json_decode($college['locations']);
            $college['contacts'] = json_decode($college['contacts']);
            $college['social_media'] = json_decode($college['social_media']);
            $college['highlight_pictures_urls'] = json_decode($college['highlight_pictures_urls']);
            echo json_encode($college);
        } else {
            $stmt = $db->query("SELECT id, name, logo_url, abbreviation FROM colleges ORDER BY name");
            echo json_encode($stmt->fetchAll());
        }
        return;
    }

    // Create new college
    if ($method === 'POST') {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("INSERT INTO colleges (name, abbreviation, description, branches, locations, contacts, social_media, logo_url, highlight_pictures_urls) VALUES (:name, :abbr, :desc, :branches, :locs, :contacts, :social, :logo, :pics)");
        $stmt->execute([
            'name'         => $input['name'],
            'abbr'         => $input['abbreviation'] ?? '',
            'desc'         => $input['description'] ?? '',
            'branches'     => json_encode($input['branches'] ?? []),
            'locs'         => json_encode($input['locations'] ?? []),
            'contacts'     => json_encode($input['contacts'] ?? new stdClass()),
            'social'       => json_encode($input['social_media'] ?? new stdClass()),
            'logo'         => $input['logo_url'] ?? '',
            'pics'         => json_encode($input['highlight_pictures_urls'] ?? [])
        ]);
        echo json_encode(['id' => $db->lastInsertId(), 'success' => true]);
        return;
    }

    // Update college
    if ($method === 'PUT' && $collegeId) {
        $input = json_decode(file_get_contents('php://input'), true);
        $stmt = $db->prepare("UPDATE colleges SET name=:name, abbreviation=:abbr, description=:desc, branches=:branches, locations=:locs, contacts=:contacts, social_media=:social, logo_url=:logo, highlight_pictures_urls=:pics WHERE id=:id");
        $stmt->execute([
            'id'           => $collegeId,
            'name'         => $input['name'],
            'abbr'         => $input['abbreviation'] ?? '',
            'desc'         => $input['description'],
            'branches'     => json_encode($input['branches']),
            'locs'         => json_encode($input['locations']),
            'contacts'     => json_encode($input['contacts']),
            'social'       => json_encode($input['social_media']),
            'logo'         => $input['logo_url'],
            'pics'         => json_encode($input['highlight_pictures_urls'])
        ]);
        echo json_encode(['success' => true]);
        return;
    }

    // Delete college
    if ($method === 'DELETE' && $collegeId) {
        $stmt = $db->prepare("DELETE FROM colleges WHERE id = :id");
        $stmt->execute(['id' => $collegeId]);
        echo json_encode(['success' => true]);
        return;
    }

    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed']);
}